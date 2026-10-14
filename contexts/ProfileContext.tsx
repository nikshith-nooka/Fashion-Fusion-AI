import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { saveUserProfile, uploadWardrobeImage } from '../services/dbService';
import type { StyleDNA, BodyProfile, UserProfile, WardrobeItemData } from '../types';

interface ProfileContextType extends UserProfile {
  setStyleDNA: (dna: StyleDNA | null) => void;
  setBodyProfile: (profile: BodyProfile) => void;
  setGender: (gender: UserProfile['gender']) => void;
  addWardrobeItem: (itemData: Omit<WardrobeItemData, 'id' | 'imageUrl'>, imageFile: File) => Promise<void>;
  removeWardrobeItem: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode, userProfile: UserProfile }> = ({ children, userProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  const updateProfileAndSave = useCallback(async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    try {
      await saveUserProfile(updatedProfile);
    } catch (err) {
      console.error("Failed to save profile:", err);
      // Optional: implement UI feedback for save failure
    }
  }, []);

  const setStyleDNA = (dna: StyleDNA | null) => {
    updateProfileAndSave({ ...profile, styleDNA: dna });
  };

  const setBodyProfile = (bodyProfile: BodyProfile) => {
    console.log(`[MONITORING] Profile Update: User '${profile.username}' set Body Type to '${bodyProfile.bodyType || 'None'}'`);
    updateProfileAndSave({ ...profile, bodyProfile });
  };
  
  const setGender = (gender: UserProfile['gender']) => {
    console.log(`[MONITORING] Profile Update: User '${profile.username}' set Gender to '${gender || 'None'}'`);
    updateProfileAndSave({ ...profile, gender });
  };

  const addWardrobeItem = async (itemData: Omit<WardrobeItemData, 'id' | 'imageUrl'>, imageFile: File) => {
    if (!profile) throw new Error("User profile not loaded.");
    // 1. Upload the image to Firebase Storage
    const imageUrl = await uploadWardrobeImage(imageFile, profile.uid);

    // 2. Create the new wardrobe item with the permanent URL
    const newItem: WardrobeItemData = {
      id: Date.now().toString(),
      ...itemData,
      imageUrl: imageUrl,
    };
    
    // 3. Update the profile state and save to Firestore
    const newWardrobe = [...profile.wardrobe, newItem];
    await updateProfileAndSave({ ...profile, wardrobe: newWardrobe });
  };

  const removeWardrobeItem = (id: string) => {
    const itemToRemove = profile.wardrobe.find(item => item.id === id);
    if (itemToRemove) {
      console.log(`[MONITORING] Wardrobe: User '${profile.username}' removed item '${itemToRemove.name}' (ID: ${id})`);
      // Note: This doesn't delete the image from Firebase Storage to keep it simple.
      // A production app would have a cloud function to handle this.
    }
    const newWardrobe = profile.wardrobe.filter(item => item.id !== id);
    updateProfileAndSave({ ...profile, wardrobe: newWardrobe });
  };
  
  const value: ProfileContextType = {
    ...profile,
    setStyleDNA,
    setBodyProfile,
    setGender,
    addWardrobeItem,
    removeWardrobeItem
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};