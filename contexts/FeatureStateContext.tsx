import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import type { OutfitWithImage, TrendResult } from '../types';

interface FeatureStateContextType {
  stylistResult: OutfitWithImage | null;
  setStylistResult: Dispatch<SetStateAction<OutfitWithImage | null>>;
  isStylistLoading: boolean;
  setIsStylistLoading: Dispatch<SetStateAction<boolean>>;
  stylistError: string | null;
  setStylistError: Dispatch<SetStateAction<string | null>>;
  
  trendsResult: TrendResult | null;
  setTrendsResult: Dispatch<SetStateAction<TrendResult | null>>;
  isTrendsLoading: boolean;
  setIsTrendsLoading: Dispatch<SetStateAction<boolean>>;
  trendsError: string | null;
  setTrendsError: Dispatch<SetStateAction<string | null>>;
}

const FeatureStateContext = createContext<FeatureStateContextType | undefined>(undefined);

export const FeatureStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stylistResult, setStylistResult] = useState<OutfitWithImage | null>(null);
  const [isStylistLoading, setIsStylistLoading] = useState<boolean>(false);
  const [stylistError, setStylistError] = useState<string | null>(null);
  
  const [trendsResult, setTrendsResult] = useState<TrendResult | null>(null);
  const [isTrendsLoading, setIsTrendsLoading] = useState<boolean>(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  
  const value = {
    stylistResult,
    setStylistResult,
    isStylistLoading,
    setIsStylistLoading,
    stylistError,
    setStylistError,
    
    trendsResult,
    setTrendsResult,
    isTrendsLoading,
    setIsTrendsLoading,
    trendsError,
    setTrendsError,
  };

  return (
    <FeatureStateContext.Provider value={value}>
      {children}
    </FeatureStateContext.Provider>
  );
};

export const useFeatureState = (): FeatureStateContextType => {
  const context = useContext(FeatureStateContext);
  if (context === undefined) {
    throw new Error('useFeatureState must be used within a FeatureStateProvider');
  }
  return context;
};
