"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LogIn, MapIcon as MapPinIcon, CreditCard, Plane, LucideProps, ArrowRight } from "lucide-react";

// --- SUBCOMPONENTES UTILITARIOS ESPECÍFICOS PARA ESTA SECCIÓN ---

const AnimatedGradientTextHow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
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

const BackgroundPatternHow = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.025] pointer-events-none z-0"> {/* Ligeramente más visible */}
    <svg
      className="absolute w-full h-full transform scale-110"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="how-it-works-grid-final" // ID Único y final
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="rgba(0, 220, 255, 0.1)" // Color de línea de la rejilla
            strokeWidth="0.15"
          />
           <circle cx="30" cy="30" r="0.3" fill="rgba(170, 100, 255, 0.1)" /> {/* Puntos púrpuras sutiles */}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#how-it-works-grid-final)" />
    </svg>
  </div>
);

const WaveDividerHow = ({ position = "top", className = "", inverted = false, waveColor = "text-slate-950" }: 
  { position: "top" | "bottom", className?: string, inverted?: boolean, waveColor?: string }) => {
  const baseClass = "absolute left-0 right-0 w-full overflow-hidden leading-0 z-10"; // z-index para que esté sobre el fondo pero debajo del contenido
  const positionClass = position === "top" ? "top-0" : "bottom-0"; 
  const transformClass = (position === "top" && inverted) || (position === "bottom" && !inverted) ? "rotate-180" : "";
  
  return (
    <div className={`${baseClass} ${positionClass} ${className}`}>
      <svg
        className={`relative block w-full h-[40px] sm:h-[60px] md:h-[80px] ${transformClass}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".07"
          className={`fill-current ${waveColor}`}
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".15"
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

const FloatingParticlesHow = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const particles = useMemo(() => {
    if (!isClient) return [];
    return [...Array(6)].map((_, i) => ({
      id: `how-floating-particle-final-${i}`,
      size: Math.random() * 2 + 0.8, // Partículas muy pequeñas: 0.8-2.8px
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 25 + 30, 
      delay: -Math.random() * 30
    }));
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/15 opacity-25" // Partículas neón muy sutiles
          style={{
            width: particle.size, height: particle.size,
            left: `${particle.x}%`, top: `${particle.y}%`,
            willChange: 'transform'
          }}
          animate={{
            x: [`calc(${particle.x}% + ${Math.random() * 25 - 12}px)`, `calc(${particle.x}% + ${Math.random() * 25 - 12}px)`], // Movimiento más corto
            y: [`calc(${particle.y}% + ${Math.random() * 25 - 12}px)`, `calc(${particle.y}% + ${Math.random() * 25 - 12}px)`],
            scale: [1, 1.05, 1] // Casi imperceptible
          }}
          transition={{
            duration: particle.duration, ease: "linear",
            repeat: Infinity, repeatType: "mirror", delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};


// --- STEP CARD COMPONENT (DEFINIDO INTERNAMENTE) ---
interface StepProps {
  icon: React.ReactElement<LucideProps>;
  title: string;
  description: string;
  step: number;
  accentColor: "cyan" | "purple" | "teal" | "blue";
  isLastStep: boolean;
}

const Step = ({ icon, title, description, step, accentColor, isLastStep }: StepProps) => {
  const accentStyles = useMemo(() => ({
    cyan: {
      cardBorder: "border-blue-800/25 dark:border-cyan-700/20",
      cardBorderHover: "hover:border-cyan-500/50",
      cardShadowHover: "hover:shadow-cyan-600/15",
      stepNumberBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
      stepNumberShadow: "shadow-cyan-500/30",
      stepNumberBorder: "border-cyan-400/40",
      iconContainerBg: "bg-gradient-to-br from-cyan-600/20 via-cyan-700/15 to-slate-900/25",
      iconContainerBorder: "border-cyan-600/30",
      iconContainerShine: "before:from-cyan-400/20",
      iconText: "text-cyan-300",
      titleText: "text-cyan-300",
      connectorBg: "bg-gradient-to-r from-cyan-500/40 via-purple-500/30 to-transparent",
    },
    purple: {
      cardBorder: "border-blue-800/25 dark:border-purple-700/20",
      cardBorderHover: "hover:border-purple-500/50",
      cardShadowHover: "hover:shadow-purple-600/15",
      stepNumberBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
      stepNumberShadow: "shadow-purple-500/30",
      stepNumberBorder: "border-purple-400/40",
      iconContainerBg: "bg-gradient-to-br from-purple-600/20 via-purple-700/15 to-slate-900/25",
      iconContainerBorder: "border-purple-600/30",
      iconContainerShine: "before:from-purple-400/20",
      iconText: "text-purple-300",
      titleText: "text-purple-300",
      connectorBg: "bg-gradient-to-r from-purple-500/40 via-blue-500/30 to-transparent",
    },
    teal: {
      cardBorder: "border-blue-800/25 dark:border-teal-700/20",
      cardBorderHover: "hover:border-teal-500/50",
      cardShadowHover: "hover:shadow-teal-600/15",
      stepNumberBg: "bg-gradient-to-br from-teal-500 to-cyan-600",
      stepNumberShadow: "shadow-teal-500/30",
      stepNumberBorder: "border-teal-400/40",
      iconContainerBg: "bg-gradient-to-br from-teal-600/20 via-teal-700/15 to-slate-900/25",
      iconContainerBorder: "border-teal-600/30",
      iconContainerShine: "before:from-teal-400/20",
      iconText: "text-teal-300",
      titleText: "text-teal-300",
      connectorBg: "bg-gradient-to-r from-teal-500/40 via-cyan-500/30 to-transparent",
    },
    blue: {
      cardBorder: "border-blue-800/25 dark:border-blue-700/20",
      cardBorderHover: "hover:border-blue-500/50",
      cardShadowHover: "hover:shadow-blue-600/15",
      stepNumberBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      stepNumberShadow: "shadow-blue-500/30",
      stepNumberBorder: "border-blue-400/40",
      iconContainerBg: "bg-gradient-to-br from-blue-600/20 via-blue-700/15 to-slate-900/25",
      iconContainerBorder: "border-blue-600/30",
      iconContainerShine: "before:from-blue-400/20",
      iconText: "text-blue-300",
      titleText: "text-blue-300",
      connectorBg: "bg-gradient-to-r from-blue-500/40 via-indigo-500/30 to-transparent",
    },
  }), [accentColor]);

  const currentAccent = accentStyles[accentColor] || accentStyles.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.1 * step, 
        ease: [0.2, 0.8, 0.2, 1.0] 
      }}
      viewport={{ once: true, amount: 0.2, margin: "-30px" }} // Ajustado viewport
      className={`group relative flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300
        bg-slate-900/60 dark:bg-black/50 backdrop-blur-lg 
        ${currentAccent.cardBorder} ${currentAccent.cardBorderHover}
        shadow-lg shadow-black/20 dark:shadow-purple-950/10 
        hover:shadow-xl ${currentAccent.cardShadowHover}
        hover:-translate-y-1`} // Elevación sutil
    >
      <motion.div 
        className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                   ${currentAccent.stepNumberBg} text-white font-extrabold text-lg sm:text-xl 
                   mb-4 z-10 shadow-lg ${currentAccent.stepNumberShadow} border-2 ${currentAccent.stepNumberBorder}
                   group-hover:scale-105 transition-transform duration-300`}
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }} // Se anima cuando la tarjeta padre entra en vista
        transition={{ type: "spring", stiffness: 190, damping: 11, delay: 0.12 * step }} // Delay basado en step
      >
        {step}
      </motion.div>
      
      {!isLastStep && (
        <div 
            className="absolute top-[3.6rem] sm:top-[4.0rem] left-1/2 w-[calc(100%+1.25rem)] md:w-[calc(100%+1.375rem)] h-[2px] hidden md:block"
            aria-hidden="true"
        >
          <motion.div 
            className={`h-full w-full ${currentAccent.connectorBg} opacity-25 group-hover:opacity-50 transition-opacity duration-300`} // Más sutil
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.12 * step + 0.25, ease: "easeOut" }} // Ajustado ease y delay
            viewport={{ once: true }}
          />
        </div>
      )}
      
      <div 
        className={`
          relative flex items-center justify-center p-3 sm:p-3.5 mb-3 rounded-xl overflow-hidden
          ${currentAccent.iconContainerBg} backdrop-blur-sm
          border ${currentAccent.iconContainerBorder} 
          shadow-inner shadow-black/30
          transform group-hover:scale-105 transition-all duration-300 ease-in-out
          before:absolute before:inset-0 before:rounded-xl 
          ${currentAccent.iconContainerShine} before:to-transparent 
          before:opacity-0 group-hover:before:opacity-50 before:transition-opacity before:duration-300
        `}
      >
        {React.cloneElement(icon, { 
          className: `h-6 w-6 sm:h-7 sm:w-7 relative z-10 
            ${currentAccent.iconText} 
            group-hover:filter group-hover:drop-shadow-[0_0_2px_currentColor]
            transition-all duration-300`,
        })}
      </div>
      
      <h3 className={`text-base sm:text-lg font-semibold mb-1.5 text-slate-100 dark:text-white transition-colors duration-300 ${currentAccent.titleText}`}>
        {title}
      </h3>
      <p className="text-slate-400/80 dark:text-slate-400/70 text-xs sm:text-sm leading-snug max-w-[230px] sm:max-w-[240px]">
        {description}
      </p>
    </motion.div>
  );
};

// --- MAIN HowItWorks COMPONENT ---
export default function HowItWorks() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const stepsData = [
    {
      id: "how-step-login-final",
      icon: <LogIn size={26}/>,
      title: "Connect Securely", // Título más corto
      description: "Use your social accounts with privacy-first zkLogin or connect your Sui wallet directly.",
      step: 1,
      accentColor: "cyan" as "cyan",
    },
    {
      id: "how-step-choose-final",
      icon: <MapPinIcon size={26} />,
      title: "Explore Experiences", // Título más corto
      description: "Browse unique tokenized travel adventures and global destinations on TokenTrip.",
      step: 2,
      accentColor: "purple" as "purple",
    },
    {
      id: "how-step-pay-final",
      icon: <CreditCard size={26} />,
      title: "Pay with Crypto", // Título más corto
      description: "Book seamlessly with SUI or other cryptos. Transparent on-chain transactions.",
      step: 3,
      accentColor: "teal" as "teal",
    },
    {
      id: "how-step-journey-final",
      icon: <Plane size={26} />,
      title: "Journey On!",
      description: "Receive your digital travel pass (NFT/voucher) & enjoy your crypto-powered trip.",
      step: 4,
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
      <section id="how-it-works" className="relative py-20 sm:py-24 md:py-28 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="h-10 md:h-12 w-2/3 max-w-sm mx-auto bg-slate-800/60 rounded-lg animate-pulse mb-3"></div>
            <div className="h-5 w-full max-w-lg mx-auto bg-slate-800/60 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[...Array(4)].map((_, index) => (
              // CORRECCIÓN DE KEY PROP AQUÍ
              <div key={`how-placeholder-step-final-${index}`} className="h-60 bg-slate-800/40 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 md:py-28 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 text-white overflow-hidden">
      {/* El waveColor debe coincidir con el fondo de la sección ANTERIOR (TravelSearch o WhyTokenTrip) */}
      <WaveDividerHow position="top" waveColor="text-slate-950" inverted={false} className="opacity-60"/> 
      
      <BackgroundPatternHow />
      <FloatingParticlesHow /> 
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
             <div className="h-8 md:h-10 w-1 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full animate-pulse"/>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              <AnimatedGradientTextHow>How TokenTrip Works</AnimatedGradientTextHow>
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-slate-300/70 max-w-lg md:max-w-xl mx-auto leading-relaxed">
            Your Web3 journey from sign-in to your next unforgettable adventure.
          </p>
        </motion.div>

        <motion.div 
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "-10px" }}
        >
          {stepsData.map((step, index) => (
            <Step
              key={step.id} 
              icon={step.icon}
              title={step.title}
              description={step.description}
              step={step.step}
              accentColor={step.accentColor}
              isLastStep={index === stepsData.length - 1}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 + stepsData.length * 0.1 }} 
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 md:mt-16 text-center"
        >
          <motion.a 
            href="#travel-search-section" 
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0px 0px 28px rgba(124, 58, 237, 0.3), 0px 0px 12px rgba(0, 220, 255, 0.2) inset"
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl
                       bg-gradient-to-r from-cyan-600 via-purple-700 to-blue-700 
                       text-white text-sm sm:text-base font-semibold tracking-wide 
                       shadow-lg shadow-purple-900/25 
                       border border-transparent hover:border-purple-500/30 
                       transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-700 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative z-10">Start Your TokenTrip</span> {/* Texto del botón cambiado */}
             <motion.div className="relative z-10 ml-1.5"
                animate={{ x: [0,2.5,0]}}
                transition={{duration: 1.1, repeat: Infinity, ease: "easeInOut"}}
             >
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
      {/* La ola inferior debe coincidir con el fondo de la SIGUIENTE sección o el footer */}
      <WaveDividerHow position="bottom" waveColor="text-slate-950" inverted={true} className="opacity-50"/> 
      <style jsx global>{`
        /* Estilos globales necesarios, como animate-gradient-x si se usa */
      `}</style>
    </section>
  );
}