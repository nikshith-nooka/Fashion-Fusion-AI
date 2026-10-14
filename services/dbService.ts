import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    updateProfile
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "firebase/storage";
import { auth, db, storage, googleProvider } from "../firebase";
import type { UserProfile } from "../types";

/**
 * Creates a new user in Firebase Auth and a corresponding user profile in Firestore.
 */
export async function createUser(
  username: string,
  password: string
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    `${username}@fashionfusion.app`,
    password
  );
  const user = userCredential.user;
  if (!user) {
    throw new Error("User creation failed.");
  }

  await updateProfile(user, { displayName: username });

  const newUserProfile: UserProfile = {
    uid: user.uid,
    username,
    styleDNA: null,
    bodyProfile: { bodyType: "" },
    gender: "",
    wardrobe: [],
  };

  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, newUserProfile);

  return newUserProfile;
}

/**
 * Logs in a user via Firebase Auth and retrieves their profile from Firestore.
 */
export async function loginUser(
  username: string,
  password: string
): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    `${username}@fashionfusion.app`,
    password
  );
  const user = userCredential.user;
  if (!user) {
    throw new Error("Login failed.");
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  } else {
    if (username.toLowerCase() === "nikki") {
      const newAdminProfile: UserProfile = {
        uid: user.uid,
        username: "nikki",
        styleDNA: null,
        bodyProfile: { bodyType: "" },
        gender: "",
        wardrobe: [],
      };
      const adminDocRef = doc(db, "users", user.uid);
      await setDoc(adminDocRef, newAdminProfile);
      return newAdminProfile;
    }
    throw new Error("User profile not found.");
  }
}

/**
 * Signs in a user with their Google Account and creates a profile if it doesn't exist.
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  if (!user) {
    throw new Error("Google Sign-In failed.");
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  } else {
    const username =
      user.displayName || user.email?.split("@")[0] || `user_${user.uid.substring(0, 5)}`;

    await updateProfile(user, { displayName: username });

    const newUserProfile: UserProfile = {
      uid: user.uid,
      username,
      styleDNA: null,
      bodyProfile: { bodyType: "" },
      gender: "",
      wardrobe: [],
    };

    await setDoc(userDocRef, newUserProfile);
    return newUserProfile;
  }
}

/**
 * Fetches a user profile from Firestore by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  } else {
    return null;
  }
}

/**
 * Saves/updates a user's profile in Firestore.
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const userDocRef = doc(db, "users", profile.uid);
  await setDoc(userDocRef, profile, { merge: true });
}

/**
 * Retrieves all user profiles from Firestore for the admin dashboard.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const usersColRef = collection(db, "users");
  const usersSnapshot = await getDocs(usersColRef);
  const usersList = usersSnapshot.docs.map((doc) => doc.data() as UserProfile);
  return usersList;
}

/**
 * Uploads an image for a wardrobe item to Firebase Storage.
 * @returns The public URL of the uploaded image.
 */
export async function uploadWardrobeImage(
  file: File,
  userId: string
): Promise<string> {
  if (!userId) throw new Error("User not authenticated for image upload.");
  const imagePath = `wardrobes/${userId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, imagePath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}