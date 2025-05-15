"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import TripCard from "./TripCard";

// Animated gradient text component for consistent styling
// Animated gradient text component for consistent styling
const AnimatedGradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => { // <--- CORRECCIÓN AQUÍ
    return (
      <span // Cambiado de motion.span a span si la animación de gradiente es por CSS ('animate-gradient-x')
            // Si quieres animar la entrada del span con Framer Motion, mantenlo como motion.span
            // y añade las props de Framer Motion como en la versión anterior del componente.
        className={`bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-teal-400 animate-gradient-x ${className}`}
      >
        {children}
      </span>
    );
  };

// Background pattern for visual interest
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full opacity-5">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  </div>
);

// Wave divider for section transition
const WaveDivider = ({ position = "top", className = "" }) => {
  return (
    <div
      className={`absolute ${position}-0 left-0 right-0 h-16 w-full overflow-hidden leading-0 transform ${position === "top" ? "rotate-180" : ""} ${className}`}
    >
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-16 w-full"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          className="fill-current text-gray-950 dark:text-gray-800"
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          className="fill-current text-gray-950 dark:text-gray-800"
        />
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          className="fill-current text-gray-950 dark:text-gray-800"
        />
      </svg>
    </div>
  );
};

// Extend Trip interface to include optional NFT-like properties
interface Trip {
  image: string;
  title: string;
  location: string;
  rating: number;
  priceUSD: number;
  suiPrice: number;
  tags?: string[];
  id: string;
  tokenId?: string; // Optional: for NFT-like experience
  rarity?: string; // Optional: Common, Rare, Epic, Legendary
}

export default function FeaturedTrips() {
  const [activeTab, setActiveTab] = useState("Trending");
  
  // Enhanced mock data for featured trips - REPLACE with actual data source or API call
  const trips: Trip[] = [
    { 
      id: "1", 
      image: "/TokenTripCancun.png", 
      title: "Cancun All-Inclusive Resort", 
      location: "Cancun, Mexico", 
      rating: 4.8, 
      priceUSD: 1299, 
      suiPrice: 432.33, 
      tags: ["Beach", "All-Inclusive"],
      tokenId: "TRIP-0291",
      rarity: "Rare"
    },
    { 
      id: "2", 
      image: "/TokenTripCdMex.png", 
      title: "World Cup 2026 Mexico City Package", 
      location: "Mexico City, Mexico", 
      rating: 4.9, 
      priceUSD: 2499, 
      suiPrice: 833.00, 
      tags: ["World Cup", "City", "Sports"],
      tokenId: "TRIP-0145",
      rarity: "Legendary"
    },
    { 
      id: "3", 
      image: "/TokenTripTulum.png", 
      title: "Tulum Beach Retreat & Yoga", 
      location: "Tulum, Mexico", 
      rating: 4.7, 
      priceUSD: 899, 
      suiPrice: 299.67, 
      tags: ["Beach", "Wellness"],
      tokenId: "TRIP-0376",
      rarity: "Common"
    },
    { 
      id: "4", 
      image: "/TokenTripCdMexInm.png", 
      title: "Mexico City Cultural Immersion", 
      location: "Mexico City, Mexico", 
      rating: 4.6, 
      priceUSD: 799, 
      suiPrice: 266.33, 
      tags: ["City", "Cultural"],
      tokenId: "TRIP-0412",
      rarity: "Common"
    },
    { 
      id: "5", 
      image: "/TokenTripLA.png", 
      title: "World Cup 2026 LA Experience", 
      location: "Los Angeles, USA", 
      rating: 4.8, 
      priceUSD: 3299, 
      suiPrice: 1099.67, 
      tags: ["World Cup", "City", "Sports"],
      tokenId: "TRIP-0098",
      rarity: "Epic"
    },
    { 
      id: "6", 
      image: "/TokenTripLosCabos.png", 
      title: "Cabo San Lucas Luxury Villa", 
      location: "Cabo San Lucas, Mexico", 
      rating: 4.9, 
      priceUSD: 1899, 
      suiPrice: 633.00, 
      tags: ["Beach", "Luxury"],
      tokenId: "TRIP-0233",
      rarity: "Rare"
    },
  ];

  // Filter trips based on active tab
  const getFilteredTrips = () => {
    if (activeTab === "World Cup") {
      return trips.filter(trip => trip.tags?.includes("World Cup"));
    } else if (activeTab === "Mexico") {
      return trips.filter(trip => trip.location.includes("Mexico"));
    } else { // "Trending" could be a mix or all, perhaps sorted by rating or popularity
      return trips.sort((a,b) => b.rating - a.rating).slice(0, 6); // Show top 6 trending
    }
  };

  const filteredTrips = getFilteredTrips();
  const tabs = ["Trending", "Mexico", "World Cup"];

  // Component variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-950 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <BackgroundPattern />
      <WaveDivider position="top" className="opacity-20" />
      <WaveDivider position="bottom" className="opacity-20" />
      
      {/* Floating particles - subtle Web3 touch */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
            animate={{
              x: [
                `calc(${Math.random() * 100}% - 10px)`,
                `calc(${Math.random() * 100}% - 10px)`,
                `calc(${Math.random() * 100}% - 10px)`
              ],
              y: [
                `calc(${Math.random() * 100}% - 10px)`,
                `calc(${Math.random() * 100}% - 10px)`,
                `calc(${Math.random() * 100}% - 10px)`
              ],
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            {/* Premium Web3 typography with animated gradient */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full" />
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <AnimatedGradientText>
                  Featured Experiences
                </AnimatedGradientText>
              </h2>
            </div>
            <p className="text-lg text-gray-300/90 max-w-md">
              Discover our handpicked selection of extraordinary destinations, 
              exclusively curated and tokenized for the ultimate travel experience.
            </p>
          </motion.div>

          {/* Enhanced tab styling for premium Web3 feel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex mt-8 md:mt-0"
          >
            <div className="flex backdrop-blur-md bg-slate-800/30 rounded-xl p-1 border border-white/10 shadow-lg shadow-purple-900/20">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`relative px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-300
                    ${activeTab === tab
                      ? "text-white" // Active tab text color
                      : "text-gray-400 hover:text-gray-200"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="featuredTripsActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-600 to-teal-500 rounded-lg shadow-lg shadow-purple-900/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {activeTab === tab && <Sparkles className="h-3.5 w-3.5" />}
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trip Cards Grid with AnimatePresence for filter transitions */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} // This forces re-render when tab changes
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                image={trip.image}
                title={trip.title}
                location={trip.location}
                rating={trip.rating}
                priceUSD={trip.priceUSD}
                suiPrice={trip.suiPrice}
                tags={trip.tags}
                tokenId={trip.tokenId}
                rarity={trip.rarity}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Button - styled consistently with Hero CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0px 0px 25px rgba(124, 58, 237, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center bg-gradient-to-r from-cyan-500 via-purple-600 to-teal-500 hover:from-cyan-600 hover:via-purple-700 hover:to-teal-600 text-white font-bold py-4 px-10 rounded-xl text-lg shadow-lg shadow-purple-900/30 backdrop-blur-sm border border-white/10 transition-all duration-300 group"
          >
            <span className="mr-2">Explore All Destinations</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut",
                repeatDelay: 1
              }}
            >
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}