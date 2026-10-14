import React from 'react';
import { motion } from 'framer-motion';
import type { OutfitWithImage, ClothingItem } from '../types';

interface OutfitCardProps {
  outfit: OutfitWithImage;
}

const ItemCard: React.FC<{item: ClothingItem}> = ({ item }) => {
  return (
    <div className="bg-gray-200/50 dark:bg-black/30 rounded-lg border border-gray-300 dark:border-white/10 p-3 flex justify-between items-center gap-4">
        <div className="flex-grow min-w-0">
            <h5 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{item.name}</h5>
            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{item.description}</p>
        </div>
        <a 
            href={item.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-3 py-1 text-xs font-bold text-black bg-cyan-300 rounded-full hover:bg-cyan-200 transition-colors"
        >
            Buy Now
        </a>
    </div>
  )
}


export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit }) => {
  return (
    <motion.div 
      className="bg-white/60 dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg border border-gray-300 dark:border-white/10 backdrop-blur-xl group flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <img src={outfit.imageUrl} alt={outfit.name} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-syne text-2xl font-bold text-fuchsia-500 dark:text-fuchsia-300 mb-2 tracking-tight">{outfit.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed flex-grow">{outfit.description}</p>
        <div className="space-y-3">
            <h4 className="font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Shop The Look:</h4>
            {outfit.items.map((item, index) => (
              <ItemCard key={index} item={item} />
            ))}
        </div>
      </div>
    </motion.div>
  );
};