export interface ClothingItem {
  name: string;
  description: string;
  purchaseUrl: string;
}

export interface Outfit {
  name: string;
  description: string;
  items: ClothingItem[];
  imagePrompt: string;
}

export interface OutfitWithImage {
  name: string;
  description: string;
  items: ClothingItem[];
  imagePrompt: string;
  imageUrl: string;
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export interface TrendSource {
  uri: string;
  title: string;
}

export interface TrendResult {
  text: string;
  sources: TrendSource[];
}

export interface StyleDNA {
    title: string;
    summary: string;
    traits: string[];
    colorPalette: {
        name:string;
        hexCodes: string[];
    };
}

export interface BodyProfile {
    bodyType: 'Hourglass' | 'Pear' | 'Apple' | 'Rectangle' | 'Inverted Triangle' | '';
}

export interface QuizQuestion {
    id: number;
    question: string;
    answers: { text: string; value: string }[];
}

// Represents an item in the wardrobe's data structure
export interface WardrobeItemData {
    id: string;
    name: string;
    category: 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Footwear' | 'Accessory' | 'Unknown';
    color: string;
    imageUrl: string; // This will now be a permanent URL from Firebase Storage
}

// Represents an item in the wardrobe for UI display, which might have a temporary object URL
export interface WardrobeItem extends WardrobeItemData {}

// Represents the data structure for a user's entire profile stored in the DB
export interface UserProfile {
  uid: string; // Firebase Auth User ID
  username: string;
  styleDNA: StyleDNA | null;
  bodyProfile: BodyProfile;
  gender: 'Male' | 'Female' | 'Other' | '';
  wardrobe: WardrobeItemData[];
}

// Represents a shoppable item within the Fashion Library
export interface FashionStyleItem {
    name: string;
    description: string;
    purchaseUrl: string;
}

// Represents the full response for a Fashion Library query
export interface FashionStyleInfo {
    styleName: string;
    description: string;
    keyElements: string[];
    shoppableLook: {
        lookName: string;
        items: FashionStyleItem[];
    };
    sources: TrendSource[];
}
