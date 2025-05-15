"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield, Star, Network, LucideProps, ArrowRight } from "lucide-react";

// --- SUBCOMPONENTES (Mantenidos y Refinados) ---

// Animated gradient text for headings (consistent with Hero)
const AnimatedGradientTextWhy = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.5 }}
      className={`relative inline-block text-transparent bg-clip-text 
        bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 
        ${className}`}
    >
      {children}
    </motion.span>
  );
};

// SVG Background Pattern Component (subtle dark neon)
const BackgroundPatternWhy = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.02] pointer-events-none z-0">
    <svg
      className="absolute w-full h-full transform scale-110"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="why-tokentrip-grid-v3" // ID ÚNICO
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="rgba(0, 220, 255, 0.15)" 
            strokeWidth="0.15"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#why-tokentrip-grid-v3)" />
    </svg>
  </div>
);

// Wave Divider Component
const WaveDividerWhy = ({ position = "top", className = "", inverted = false, waveColor = "text-slate-950" }: 
  { position: "top" | "bottom", className?: string, inverted?: boolean, waveColor?: string }) => {
  const baseClass = "absolute left-0 right-0 w-full overflow-hidden leading-0 z-10";
  const positionClass = position === "top" ? "top-0" : "bottom-0"; 
  const transformClass = (position === "top" && inverted) || (position === "bottom" && !inverted) ? "rotate-180" : "";
  
  return (
    <div className={`${baseClass} ${positionClass} ${className}`}>
      <svg
        className={`relative block w-full h-[45px] sm:h-[65px] md:h-[85px] ${transformClass}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".08"
          className={`fill-current ${waveColor}`}
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".18"
          className={`fill-current ${waveColor}`}
        />
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          className={`fill-current ${waveColor}`}
        />
      </svg>
    </div>
  );
};

// Floating particles (client-side only)
const FloatingParticlesWhy = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const particles = useMemo(() => {
    if (!isClient) return [];
    return [...Array(5)].map((_, i) => ({ // Menos partículas
      id: `why-tokentrip-particle-v3-${i}`, // ID único
      size: Math.random() * 2.5 + 0.8, 
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 22 + 28, 
      delay: -Math.random() * 30
    }));
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-cyan-500/15 to-purple-600/10 opacity-30" // Ajustado
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            willChange: 'transform'
          }}
          animate={{
            x: [`calc(${particle.x}% + ${Math.random() * 30 - 15}px)`, `calc(${particle.x}% + ${Math.random() * 30 - 15}px)`],
            y: [`calc(${particle.y}% + ${Math.random() * 30 - 15}px)`, `calc(${particle.y}% + ${Math.random() * 30 - 15}px)`],
            scale: [1, 1.1, 1] // Más sutil
          }}
          transition={{
            duration: particle.duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "mirror",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

// --- FEATURE CARD COMPONENT ---
interface FeatureProps {
  icon: React.ReactElement<LucideProps>;
  title: string;
  description: string;
  accentColor: "cyan" | "purple" | "teal" | "blue";
  index: number;
}

const Feature = ({ icon, title, description, accentColor, index }: FeatureProps) => {
  const accentStyles = useMemo(() => ({
    cyan: {
      cardBorderHover: "hover:border-cyan-500/40",
      cardShadowHover: "hover:shadow-cyan-600/15",
      iconContainerBg: "bg-gradient-to-br from-cyan-600/15 via-cyan-700/10 to-transparent",
      iconContainerBorder: "border-cyan-600/25",
      iconContainerShine: "before:from-cyan-400/15",
      iconText: "text-cyan-300",
      titleTextHover: "group-hover:text-cyan-300",
    },
    purple: {
      cardBorderHover: "hover:border-purple-500/40",
      cardShadowHover: "hover:shadow-purple-600/15",
      iconContainerBg: "bg-gradient-to-br from-purple-600/15 via-purple-700/10 to-transparent",
      iconContainerBorder: "border-purple-600/25",
      iconContainerShine: "before:from-purple-400/15",
      iconText: "text-purple-300",
      titleTextHover: "group-hover:text-purple-300",
    },
    teal: {
      cardBorderHover: "hover:border-teal-500/40",
      cardShadowHover: "hover:shadow-teal-600/15",
      iconContainerBg: "bg-gradient-to-br from-teal-600/15 via-teal-700/10 to-transparent",
      iconContainerBorder: "border-teal-600/25",
      iconContainerShine: "before:from-teal-400/15",
      iconText: "text-teal-300",
      titleTextHover: "group-hover:text-teal-300",
    },
    blue: {
      cardBorderHover: "hover:border-blue-500/40",
      cardShadowHover: "hover:shadow-blue-600/15",
      iconContainerBg: "bg-gradient-to-br from-blue-600/15 via-blue-700/10 to-transparent",
      iconContainerBorder: "border-blue-600/25",
      iconContainerShine: "before:from-blue-400/15",
      iconText: "text-blue-300",
      titleTextHover: "group-hover:text-blue-300",
    },
  }), []);

  const currentAccent = accentStyles[accentColor] || accentStyles.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.06 * index, 
        ease: [0.2, 0.8, 0.2, 1.0] 
      }}
      viewport={{ once: true, amount: 0.25, margin: "-20px" }} // Ajustado viewport
      className={`group flex flex-col items-center text-center p-6 md:p-7 rounded-2xl transition-all duration-300
        bg-slate-900/60 dark:bg-black/50 backdrop-blur-lg
        border border-slate-700/20 dark:border-blue-900/20 
        ${currentAccent.cardBorderHover}
        shadow-lg shadow-black/20 dark:shadow-purple-950/10
        hover:shadow-xl ${currentAccent.cardShadowHover}
        hover:-translate-y-1.5`}
    >
      <div 
        className={`
          relative flex items-center justify-center p-3.5 sm:p-4 mb-4 rounded-full overflow-hidden
          ${currentAccent.iconContainerBg}
          before:absolute before:inset-0 before:rounded-full 
          ${currentAccent.iconContainerShine} before:to-transparent 
          before:opacity-0 group-hover:before:opacity-60 before:transition-opacity before:duration-300
          shadow-inner shadow-black/25
          border ${currentAccent.iconContainerBorder}
          transition-all duration-300 transform group-hover:scale-105
        `}
      >
        {React.cloneElement(icon, { 
          className: `h-6 w-6 sm:h-7 sm:w-7 relative z-10 
            ${currentAccent.iconText} 
            group-hover:filter group-hover:drop-shadow-[0_0_2px_currentColor]
            transition-all duration-300` 
        })}
      </div>

      <h3 className={`text-md sm:text-lg font-semibold mb-2 text-slate-50 dark:text-white
        ${currentAccent.titleTextHover}
        transition-colors duration-300`}>
        {title}
      </h3>

      <p className="text-slate-400/80 dark:text-slate-400/70 text-xs sm:text-sm leading-relaxed max-w-[240px]">
        {description}
      </p>
    </motion.div>
  );
};


// --- MAIN WhyTokenTrip COMPONENT ---
export default function WhyTokenTrip() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const features = [
    {
      id: "feat-crypto-payment", // ID único para la key
      icon: <CreditCard size={28}/>,
      title: "Seamless Crypto Payments",
      description: "Utilize SUI & other popular cryptos for borderless, secure transactions on all your travel bookings.",
      accentColor: "cyan" as "cyan",
    },
    {
      id: "feat-zklogin",
      icon: <Shield size={28}/>,
      title: "Effortless zkLogin",
      description: "One-click sign-in with your existing social accounts, powered by zero-knowledge privacy.",
      accentColor: "purple" as "purple",
    },
    {
      id: "feat-exclusive-experiences",
      icon: <Star size={28} />,
      title: "Exclusive Tokenized Experiences",
      description: "Unlock unique, curated adventures and packages, verifiable on the blockchain.",
      accentColor: "teal" as "teal",
    },
    {
      id: "feat-transparent-blockchain",
      icon: <Network size={28}/>,
      title: "Transparent & Secure",
      description: "Enjoy unparalleled transparency and security with every booking recorded on-chain.",
      accentColor: "blue" as "blue",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };
  
  if (!isMounted) {
    return (
      <section className="relative py-20 sm:py-24 md:py-28 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-16">
            <div className="h-10 md:h-12 w-2/3 max-w-md mx-auto bg-slate-800/60 rounded-lg animate-pulse mb-3"></div>
            <div className="h-5 w-full max-w-lg mx-auto bg-slate-800/60 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {/* CORRECCIÓN DE KEY PROP AQUÍ */}
            {[...Array(4)].map((_, index) => (
              <div key={`why-placeholder-feature-${index}`} className="h-56 bg-slate-800/40 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 sm:py-24 md:py-28 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 text-white overflow-hidden"> {/* Fondo oscuro consistente */}
      {/* Asegúrate que waveColor y inverted sean correctos para la transición desde TravelSearch (o Hero si TravelSearch se superpone mucho) */}
      <WaveDividerWhy position="top" waveColor="text-slate-950" inverted={false} className="opacity-50"/> 
      
      <BackgroundPatternWhy />
      <FloatingParticlesWhy /> 
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2.5 mb-3">
             <div className="h-8 md:h-10 w-1 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full animate-pulse"/>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              <AnimatedGradientTextWhy>Why Choose TokenTrip?</AnimatedGradientTextWhy>
            </h2>
          </div>
          <p className="text-md sm:text-lg md:text-xl text-slate-300/80 max-w-xl mx-auto leading-relaxed">
            Your crypto passport to unforgettable experiences.
            Building the future of travel, powered by <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Web3</span>.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "-30px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" // Gap reducido
        >
          {features.map((feature, index) => (
            <Feature
              key={feature.id} // USAR UN ID ÚNICO DE feature SI EXISTE, SINO feature.title
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 + features.length * 0.08 }} 
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 md:mt-16 text-center"
        >
          <motion.a 
            href="#travel-search-section" // Enlace al buscador o a una página de "empezar"
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0px 0px 28px rgba(124, 58, 237, 0.35), 0px 0px 12px rgba(0, 220, 255, 0.25) inset"
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl
                       bg-gradient-to-r from-cyan-600 via-purple-700 to-blue-700 
                       text-white text-sm sm:text-base font-semibold tracking-wide 
                       shadow-lg shadow-purple-900/30 
                       border border-transparent hover:border-purple-500/40 
                       transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-700 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative z-10">Start Your Journey</span>
             <motion.div className="relative z-10 ml-1.5"
                animate={{ x: [0,2.5,0]}}
                transition={{duration: 1.1, repeat: Infinity, ease: "easeInOut"}}
             >
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
      {/* El color de la ola inferior debe coincidir con el fondo de la SIGUIENTE sección */}
      <WaveDividerWhy position="bottom" waveColor="text-slate-950" inverted={true} className="opacity-60"/> 
      <style jsx global>{`
        /* Si usas animate-gradient-x para AnimatedGradientTextWhy, asegúrate de que esté definido */
        /* en tu tailwind.config.js o en un archivo CSS global. */
      `}</style>
    </section>
  );
}