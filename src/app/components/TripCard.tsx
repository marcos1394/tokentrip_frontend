"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Shield, Tag } from "lucide-react";

// Enhanced Trip Card props with optional Web3/NFT properties
interface TripCardProps {
  image: string;
  title: string;
  location: string;
  rating: number;
  priceUSD: number;
  suiPrice: number;
  tags?: string[];
  tokenId?: string; // For NFT-like experience
  rarity?: string; // Common, Rare, Epic, Legendary
}

// Helper for selecting the right rarity color
const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case "Common":
      return "from-blue-400 to-blue-600";
    case "Rare":
      return "from-purple-400 to-purple-600";
    case "Epic":
      return "from-pink-400 to-pink-600";
    case "Legendary":
      return "from-amber-400 to-amber-600";
    default:
      return "from-gray-400 to-gray-600";
  }
};

export default function TripCard({
  image,
  title,
  location,
  rating,
  priceUSD,
  suiPrice,
  tags,
  tokenId,
  rarity,
}: TripCardProps) {
  // Enhanced animations with more sophisticated transitions
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -12, 
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      className="group flex flex-col h-full relative rounded-2xl overflow-hidden"
    >
      {/* Card outer glow and container */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700" />

      {/* Card inner with glassmorphism effect */}
      <div className="relative h-full flex flex-col bg-slate-800/60 backdrop-blur-lg shadow-xl dark:shadow-purple-900/20 group-hover:shadow-purple-500/30 border border-white/5 group-hover:border-white/10 transition-all duration-500 rounded-2xl overflow-hidden">
        {/* Token ID badge - for NFT-like experience */}
        {tokenId && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/10">
            <Shield className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-mono font-medium tracking-tight">{tokenId}</span>
          </div>
        )}

        {/* Rarity indicator (if applicable) */}
        {rarity && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20 px-3 py-1 bg-gradient-to-r backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold text-white shadow-lg scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-gradient-to-r ${getRarityColor(rarity)}">
            <div className={`bg-gradient-to-r ${getRarityColor(rarity)} p-0.5 rounded-full`}>
              {rarity}
            </div>
          </div>
        )}

        {/* Image Container with enhanced hover effects */}
        <div className="relative h-60 overflow-hidden">
          {/* Pre-load animation that runs when the card comes into view */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Actual image with enhanced hover animation */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-115"
          />

          {/* Gradient overlay with improved aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
          
          {/* Tags - positioned for better visibility, with enhanced styling */}
          {tags && tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {tags.slice(0, 2).map(tag => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full border border-white/20 shadow-lg"
                >
                  <Tag className="h-3 w-3 opacity-70" />
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
          
          {/* Rating - improved styling with animation */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute top-16 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 z-10"
          >
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            {rating.toFixed(1)}
          </motion.div>
          
          {/* Location - with enhanced styling */}
          <div className="absolute bottom-3 left-3 text-white flex items-center gap-2 z-10">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
              <MapPin className="h-4 w-4 text-purple-300" />
            </div>
            <span className="text-sm font-medium tracking-wide bg-black/60 backdrop-blur-sm py-1 px-3 rounded-full border border-white/10">
              {location}
            </span>
          </div>
        </div>
        
        {/* Content Area with enhanced design */}
        <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-slate-800/0 to-slate-900/90">
          {/* Premium title styling */}
          <h3 className="font-bold text-xl mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500">
            {title}
          </h3>
          
          {/* Price Section with enhanced visuals */}
          <div className="mt-auto pt-4 flex justify-between items-end border-t border-white/10">
            <div>
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <span className="inline-block h-2 w-2 bg-teal-400 rounded-full animate-pulse"></span>
                Verified Price
              </div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
                ${priceUSD.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-teal-400 flex items-center gap-1.5 mt-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.31 16.5h-1.57v-1.28h1.57v1.28zm1.46-4.21c-.63.47-1.04.83-1.22 1.52-.07.3-.22.53-.46.69-.25.16-.6.25-1.03.25-.36 0-.65-.09-.88-.25-.22-.16-.33-.39-.33-.69 0-.29.06-.55.17-.78.11-.23.27-.45.47-.65.2-.2.43-.39.7-.55.32-.19.57-.39.77-.58.2-.19.34-.43.44-.69.1-.26.15-.58.15-.96 0-.64-.23-1.14-.69-1.5-.46-.36-1.09-.54-1.89-.54-.82 0-1.46.2-1.91.61-.45.41-.72.98-.8 1.71l1.53.23c.02-.37.13-.66.32-.86.19-.2.49-.3.9-.3.39 0 .69.09.89.28.2.19.3.47.3.86 0 .28-.08.51-.24.7-.16.19-.48.44-.96.74-.48.3-.84.58-1.1.84-.26.26-.46.56-.59.9-.13.34-.2.75-.2 1.24h1.57c0-.29.05-.53.14-.72.09-.19.25-.36.48-.52.23-.16.55-.37.96-.64z"/>
                </svg>
                ~{suiPrice.toFixed(2)} SUI
              </div>
            </div>
            
            {/* Enhanced View Details Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="#" 
                className="flex items-center justify-center bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/40 hover:to-purple-500/40 backdrop-blur-sm text-white font-medium py-2.5 px-5 rounded-xl border border-white/10 transition-all duration-300 group-hover:shadow-md group-hover:shadow-purple-500/30"
              >
                View Details 
                <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Ambient hover glow effect */}
      <motion.div 
        className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-teal-500 opacity-0 group-hover:opacity-100 blur transition-all duration-1000 z-[-1]"
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "mirror", 
          duration: 5,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}