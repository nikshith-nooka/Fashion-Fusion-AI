import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import type { Outfit, StyleDNA, QuizQuestion, WardrobeItem, WardrobeItemData, BodyProfile, UserProfile, FashionStyleInfo, TrendSource } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const clothingItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The specific name of the clothing item (e.g., "Vintage High-Waisted Mom Jeans").' },
        description: { type: Type.STRING, description: 'A brief, compelling description of the item and why it fits the look.' },
        purchaseUrl: { type: Type.STRING, description: 'A plausible but fictional product URL for this item from a popular INDIAN e-commerce site like Myntra, Ajio, Amazon.in, or Flipkart.'}
    },
    required: ['name', 'description', 'purchaseUrl']
};

const outfitSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "A catchy, creative name for the complete outfit (e.g., 'Cyberpunk City Wanderer', 'Cozy Autumn Reader')." },
        description: { type: Type.STRING, description: "A one-paragraph description of the outfit's overall vibe, why it's suitable for the mood/occasion, and how the pieces come together." },
        items: {
            type: Type.ARRAY,
            description: "A list of 3 to 5 specific clothing items that make up the outfit.",
            items: clothingItemSchema
        },
        imagePrompt: { type: Type.STRING, description: "A detailed, descriptive prompt for an AI image generator to create a photorealistic moodboard of this outfit. Include details about the model's pose, the background, the lighting, and the overall aesthetic. Example: 'A full-body shot of a cool, confident person wearing a vintage band t-shirt, ripped black skinny jeans, and chunky platform boots. They are leaning against a graffiti-covered brick wall in a vibrant city alleyway at dusk. The lighting is dramatic, with neon sign reflections. Moody, edgy, 90s grunge aesthetic, photorealistic.'" }
    },
    required: ['name', 'description', 'items', 'imagePrompt']
};


export async function generateOutfitsForMood(
    mood: string,
    occasion: string,
    gender: UserProfile['gender'],
    useWardrobe: boolean,
    wardrobe: WardrobeItem[],
    styleDNA?: StyleDNA,
    bodyProfile?: BodyProfile
): Promise<Outfit> { // Return a single Outfit, not Outfit[]
    
    let systemInstruction = `You are a world-class AI personal stylist named Fusion, specializing in the Indian fashion market. Your goal is to create a single, perfect, shoppable outfit based on user input.

    - CRITICAL: All purchase URLs MUST be for popular INDIAN e-commerce websites (e.g., Myntra, Ajio, Amazon.in, Flipkart, Tata CLiQ, Shopsy). The currency context is Indian Rupees (INR).
    - Analyze the user's mood, occasion, gender, and personal style profile (if provided).
    - Create a complete, cohesive look with 3-5 items.
    - For each item, provide a name, a short description, and a plausible fictional purchase URL from an Indian retailer.
    - Provide a catchy name and overall description for the outfit.
    - Create a highly detailed image prompt for an AI image generator to visualize the outfit as a photorealistic moodboard.
    - Respond ONLY with a valid JSON object that matches the provided schema. Do not include any extra text, markdown formatting, or apologies.`;

    let userPrompt = `Here is my request:\n- My current mood/vibe: "${mood}"\n- Occasion: "${occasion || 'Not specified'}"\n- My Gender: "${gender || 'Not specified'}"`;

    if (styleDNA) {
        userPrompt += `\n\nHere is my Style DNA profile for personalization:\n- Title: ${styleDNA.title}\n- Summary: ${styleDNA.summary}\n- Key Traits: ${styleDNA.traits.join(', ')}\n- Color Palette: ${styleDNA.colorPalette.name}`;
    }

    if (bodyProfile?.bodyType) {
        userPrompt += `\n\nMy body type is ${bodyProfile.bodyType}. Please suggest silhouettes and cuts that would be flattering.`
    }

    if (useWardrobe && wardrobe.length > 0) {
        const wardrobeList = wardrobe.map(item => `- ${item.name} (${item.category}, ${item.color})`).join('\n');
        userPrompt += `\n\nCRITICAL: I want to use items from my own digital wardrobe. Create an outfit using ONLY the following items. If you cannot form a complete outfit, you may supplement with one or two new items, but prioritize what I own:\n${wardrobeList}`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: outfitSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText);
        return result as Outfit;
    } catch (e) {
        console.error("Failed to parse JSON from AI:", jsonText);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
}


export async function generateImageForOutfit(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '3:4', // Portrait for fashion
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error: any) {
        console.error("Error generating image:", error.message);
        // Try to parse the error response if it's a JSON string
        try {
            if (error.message) {
                 const errJson = JSON.parse(error.message);
                 if (errJson.error && errJson.error.message) {
                    throw new Error(errJson.error.message);
                 }
            }
        } catch (e) {} // Not a JSON error message, re-throw original
        throw new Error("Failed to generate image due to an API error.");
    }
}

export function startChat(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                 systemInstruction: "You are FusionBot, a witty, sharp, and helpful AI fashion stylist. You give honest advice, sometimes with a bit of playful roasting. You're like a best friend who has amazing taste. You know all the latest trends but also respect classic, timeless style. Keep responses concise and conversational.",
            }
        });
    }
    return chat;
}

export async function sendMessageStream(chatInstance: Chat, message: string) {
    return await chatInstance.sendMessageStream({ message });
}


export async function getFashionTrends(): Promise<GenerateContentResponse> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'What are the top 3-5 fashion trends right now for young adults? For each trend, give a catchy name, a one-paragraph summary of what it is, and why it\'s popular. Use markdown for formatting with headings for each trend.',
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    return response;
}

const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        answers: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    value: { type: Type.STRING }
                },
                required: ['text', 'value']
            }
        }
    },
    required: ['id', 'question', 'answers']
};

const quizSchema = {
    type: Type.ARRAY,
    items: quizQuestionSchema
};


export async function generateStyleQuiz(): Promise<QuizQuestion[]> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Create a 5-question multiple-choice personality quiz to determine someone\'s fashion style. The questions should be fun and creative, not just about clothes. For example: "Which city is your ideal weekend getaway?" or "What\'s your go-to coffee order?". Provide 4 answer options for each question. The `value` for each answer should be a single keyword representing the style archetype (e.g., "minimalist", "bohemian", "streetwear", "classic", "eclectic", "glam", "vintage"). Make sure the `id` for each question is unique (1-5).',
        config: {
            responseMimeType: 'application/json',
            responseSchema: quizSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as QuizQuestion[];
    } catch (e) {
        console.error("Failed to parse JSON from AI for quiz:", jsonText);
        throw new Error("The AI returned an invalid quiz. Please try again.");
    }
}

const styleDNASchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A catchy, one-or-two-word title for the style DNA (e.g., "Urban Minimalist", "Vintage Romantic").' },
        summary: { type: Type.STRING, description: 'A 2-3 sentence summary of this style personality.' },
        traits: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-5 keywords that describe this style (e.g., "Effortless", "Structured", "Playful").' },
        colorPalette: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'A descriptive name for the color palette (e.g., "Earthy Neutrals", "Monochrome Pop").' },
                hexCodes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 5 hex color codes that represent this palette.' }
            },
            required: ['name', 'hexCodes']
        }
    },
    required: ['title', 'summary', 'traits', 'colorPalette']
};

export async function analyzeQuizResults(answers: Record<number, string>): Promise<StyleDNA> {
    const answerSummary = Object.values(answers).join(', ');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on a quiz where the user selected answers with the following style keywords: [${answerSummary}], analyze these choices and generate a "Style DNA" profile for them. The user chose these themes most often. Create a cohesive style profile based on these keywords.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: styleDNASchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as StyleDNA;
    } catch (e) {
        console.error("Failed to parse JSON from AI for Style DNA:", jsonText);
        throw new Error("The AI returned an invalid style profile. Please try again.");
    }
}

const clothingAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A specific and descriptive name for the clothing item (e.g., "Light-wash denim jacket with shearling collar").' },
        category: { type: Type.STRING, enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessory', 'Unknown'], description: 'The category of the clothing item.' },
        color: { type: Type.STRING, description: 'The dominant color of the item (e.g., "Navy Blue", "Olive Green", "Beige").' }
    },
    required: ['name', 'category', 'color']
};

export async function analyzeClothingImage(imageFile: File): Promise<Omit<WardrobeItemData, 'imageUrl' | 'id'>> {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: 'Analyze this image of a clothing item on a plain background. Identify its name, category, and dominant color. Respond only with JSON that matches the provided schema.' }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: clothingAnalysisSchema
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from AI for clothing analysis:", jsonText);
        throw new Error("The AI couldn't identify the item. Try a clearer photo.");
    }
}

export async function getFashionStyleInfo(query: string): Promise<FashionStyleInfo> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please provide a detailed report on the fashion style "${query}". Use your web search tool to find accurate information. 
        
        CRITICAL E-COMMERCE CONTEXT: The 'shoppableLook' must feature items with purchase URLs from popular INDIAN online stores only (Myntra, Ajio, Amazon.in, Flipkart, etc.).
        
        CRITICAL RESPONSE FORMAT: Respond ONLY with a single, valid JSON object. Do not include any extra text, markdown formatting, or apologies. The JSON object must conform to the following structure:
        {
          "styleName": "string",
          "description": "string (A detailed, multi-paragraph description of the fashion style, including its history, cultural origins, and core philosophy.)",
          "keyElements": ["string", "string", ...],
          "shoppableLook": {
            "lookName": "string",
            "items": [
              {
                "name": "string",
                "description": "string",
                "purchaseUrl": "string (URL from an INDIAN retailer)"
              },
              ...
            ]
          }
        }
        `,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        .filter(web => web && web.uri && web.title) as TrendSource[] || [];

    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText);
        return { ...result, sources: uniqueSources };
    } catch (e) {
        console.error("Failed to parse JSON from AI for fashion library:", jsonText);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
}