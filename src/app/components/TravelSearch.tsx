"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, Users, MapPin, ChevronsUpDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SearchTab = "Packages" | "Hotels" | "Flights" | "Experiences";

interface TravelSearchProps {}

export default function TravelSearch({}: TravelSearchProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>("Packages");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && target.closest('.travelers-dropdown-container') === null && !target.closest('#travelers-search-button-tokentrip')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const tabs: SearchTab[] = ["Packages", "Hotels", "Flights", "Experiences"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ activeTab, destination, checkIn, checkOut, travelers });
    // TODO: Implement actual search API call
  };

  const inputBaseClasses = "w-full p-3.5 text-sm placeholder-slate-500 dark:placeholder-slate-400/70 transition-all duration-300 focus:outline-none";
  const inputContainerClasses = "relative group bg-slate-800/60 dark:bg-black/50 border border-slate-700/50 dark:border-blue-900/70 rounded-xl focus-within:ring-1 focus-within:ring-cyan-400/80 dark:focus-within:ring-purple-500/70 shadow-inner shadow-black/25";
  const inputFieldClasses = "bg-transparent text-slate-100 dark:text-slate-200";
  const labelClasses = "text-xs font-medium text-slate-300 dark:text-slate-400/80 flex items-center gap-1.5 mb-1.5";

  const searchContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 0.8, 0.36, 1], delay: 0.1 } // Delay para aparecer después del Hero
    }
  };

  const formElementsVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: {type: "spring", stiffness:150, damping: 18} }
  };

  if (!isMounted) {
    // Placeholder más simple para SSR para evitar problemas de hidratación
    return <div id="travel-search-section" className="w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 opacity-0 h-48 md:h-56"></div>;
  }

  return (
    // ELIMINADO EL MARGEN SUPERIOR NEGATIVO. AÑADIDO MARGEN SUPERIOR POSITIVO.
    <motion.div 
      id="travel-search-section"
      className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12 md:mt-12 md:mb-20" // Margen superior normal, margen inferior
      initial="hidden"
      animate={"visible"}
      variants={searchContainerVariants}
    >
      {/* Contenedor principal con glassmorphism oscuro */}
      <div className="backdrop-blur-xl bg-slate-950/75 dark:bg-black/65 rounded-2xl md:rounded-3xl overflow-hidden border border-blue-800/30 dark:border-purple-700/40 shadow-2xl shadow-blue-950/25 dark:shadow-purple-950/30">
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-teal-500 opacity-60 animate-gradient-x"></div>
        
        <div className="relative flex overflow-x-auto border-b border-slate-700/30 dark:border-blue-900/30 bg-slate-800/30 dark:bg-black/30">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative px-5 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/70
                ${activeTab === tab
                  ? "text-white dark:text-cyan-200"
                  : "text-slate-400 hover:text-slate-100 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="relative z-10 flex items-center">
                {activeTab === tab && <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 opacity-70 text-cyan-400" />}
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeSearchTabIndicatorTokenTripV3" // ID ÚNICO
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-t-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="p-5 md:p-6 lg:p-7"> {/* Padding ajustado */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end" // Gap reducido
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            initial="hidden"
            animate="visible" 
          >
            <motion.div variants={formElementsVariants} className="space-y-1.5 lg:col-span-1 sm:col-span-2 md:col-span-1">
              <label htmlFor="destination-search-tokentrip-v2" className={labelClasses}>
                <MapPin className="h-3 w-3 text-cyan-400/70" /> Destination
              </label>
              <div className={inputContainerClasses}>
                <input
                  id="destination-search-tokentrip-v2" type="text" value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to, Nomad?"
                  className={`${inputBaseClasses} ${inputFieldClasses} pl-3 pr-9`}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div variants={formElementsVariants} className="space-y-1.5">
              <label htmlFor="checkin-search-tokentrip-v2" className={labelClasses}>
                <Calendar className="h-3 w-3 text-cyan-400/70" /> Check-in
              </label>
              <div className={inputContainerClasses}>
                <input id="checkin-search-tokentrip-v2" type="date" value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={`${inputBaseClasses} ${inputFieldClasses} px-3 date-input-web3-dark-v2`}
                />
              </div>
            </motion.div>

            <motion.div variants={formElementsVariants} className="space-y-1.5">
              <label htmlFor="checkout-search-tokentrip-v2" className={labelClasses}>
                <Calendar className="h-3 w-3 text-cyan-400/70" /> Check-out
              </label>
              <div className={inputContainerClasses}>
                <input id="checkout-search-tokentrip-v2" type="date" value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`${inputBaseClasses} ${inputFieldClasses} px-3 date-input-web3-dark-v2`}
                />
              </div>
            </motion.div>

            <motion.div variants={formElementsVariants} className="space-y-1.5 travelers-dropdown-container">
              <label htmlFor="travelers-search-button-tokentrip-v2" className={labelClasses}>
                <Users className="h-3 w-3 text-cyan-400/70" /> Travelers
              </label>
              <div className={`${inputContainerClasses} relative`}>
                <button
                  id="travelers-search-button-tokentrip-v2" type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`${inputBaseClasses} ${inputFieldClasses} px-3 flex justify-between items-center text-left`}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span>{travelers} {parseInt(travelers) === 1 ? "Traveler" : "Travelers"}</span>
                  <ChevronsUpDown className={`h-3.5 w-3.5 text-slate-400/70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -7, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -7, scale: 0.97 }}
                      transition={{ duration: 0.1, ease: "circOut" }}
                      className="absolute z-30 mt-1 w-full bg-slate-800/95 dark:bg-black/90 backdrop-blur-lg rounded-md shadow-2xl border border-blue-800/30 dark:border-purple-700/40 overflow-hidden"
                      role="listbox"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <div
                          key={num}
                          className="p-2.5 hover:bg-cyan-500/10 dark:hover:bg-purple-600/20 cursor-pointer text-slate-200 dark:text-slate-300 text-sm transition-colors"
                          onClick={() => {
                            setTravelers(num.toString());
                            setIsDropdownOpen(false);
                          }}
                          role="option"
                          aria-selected={travelers === num.toString()}
                        >
                          {num} {num === 1 ? "Traveler" : "Travelers"}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
            <motion.button 
              variants={formElementsVariants}
              type="submit"
              whileHover={{ scale: 1.01, boxShadow: "0px 0px 25px rgba(0, 180, 220, 0.25), 0 0 8px rgba(150,80,220,0.1) inset" }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-1.5 shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-purple-500/25 group lg:h-[46px]"
            >
              <Search className="h-3.5 w-3.5 transition-transform duration-400 ease-out group-hover:rotate-[720deg] group-hover:scale-110" />
              <span className="relative overflow-hidden h-5 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTab}
                    className="block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.1, ease: "circOut" }}
                  >
                    Search {activeTab}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.button>
          </motion.div>
        </form>
      </div>
      <style jsx global>{`
        .date-input-web3-dark-v2::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(0.9) sepia(0.6) hue-rotate(170deg) saturate(4); /* Cyan/Blue Neon */
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.2s ease-in-out;
        }
        .date-input-web3-dark-v2:hover::-webkit-calendar-picker-indicator {
            opacity: 0.7;
        }
      `}</style>
    </motion.div>
  );
}