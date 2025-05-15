"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, TargetAndTransition, Transition, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Cloud, Plane, MapPin, CreditCard, Instagram, Twitter, Facebook, Pocket, Twitch, Chrome } from "lucide-react";
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';
import { type WalletAccount } from '@mysten/wallet-standard';
import { useZkLogin, type SupportedProvider } from "@/hooks/useZkLogin"; // Ajusta la ruta si es necesario
import '@mysten/dapp-kit/dist/index.css';
import Image from 'next/image';

// --- SUBCOMPONENTES DEL HERO ---

// Fondo animado mejorado con elementos de viaje y efectos de scroll
const AnimatedTravelBackground = () => {
  const [isClient, setIsClient] = useState(false);
  const [clouds, setClouds] = useState<CloudState[]>([]);
  const [planes, setPlanes] = useState<PlaneState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const moonOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const moonScale = useTransform(scrollY, [0, 400], [1, 0.8]);
  const cloudOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);
  const planeOpacity = useTransform(scrollY, [0, 500], [1, 0.1]);

  useEffect(() => {
    setIsClient(true);

    // Generar nubes más visibles para el fondo slate-950
    const newCloudsData: CloudState[] = [...Array(8)].map((_, i) => ({
      id: `cloud-hero-travel-${i}`,
      style: {
        width: `${Math.random() * 180 + 100}px`,
        height: `${Math.random() * 90 + 50}px`,
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 100}%`, // Distribuir horizontalmente
        opacity: 0.4 + Math.random() * 0.3, // Opacidad aumentada para mayor visibilidad
        filter: `blur(${Math.random() * 1.5 + 0.5}px)`,
        zIndex: Math.floor(Math.random() * 2),
        willChange: 'transform, opacity',
      },
      animate: { 
        x: [`${Math.random() * -30 - 20}%`, `${Math.random() * 30 + 120}%`],
      },
      transition: {
        duration: Math.random() * 100 + 60,
        repeat: Infinity,
        ease: "linear",
        delay: -Math.random() * 100,
      },
    }));

    // Generar aviones distribuidos por toda la pantalla
    const newPlanesData: PlaneState[] = [...Array(6)].map((_, i) => {
      const startFromLeft = Math.random() > 0.5;
      return {
        id: `plane-hero-travel-${i}`,
        style: {
          top: `${Math.random() * 70 + 5}%`,
          left: startFromLeft ? '-10%' : '110%', // Unos entran por izquierda, otros por derecha
          opacity: 0.7 + Math.random() * 0.3,
          scale: 1.2 + Math.random() * 0.8,
          willChange: 'transform, opacity',
          transform: `rotate(${startFromLeft ? 0 : 180}deg)`, // Rotar según dirección
        },
        animate: {
          x: startFromLeft 
            ? ['0%', '120%'] 
            : ['0%', '-120%'],
          y: [0, -15, 10, -10, 0],
        },
        transition: {
          x: {
            duration: Math.random() * 40 + 30,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 15,
          },
          y: {
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          },
        },
      };
    });

    setClouds(newCloudsData);
    setPlanes(newPlanesData);
  }, []);

  // Fondo estático para SSR
  const staticBackground = (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="absolute top-10 right-10 md:top-16 md:right-16 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-200/60 to-gray-300/40 blur-sm"></div>
    </div>
  );

  if (!isClient) return staticBackground;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black"></div>

      {/* Luna mejorada y más visible */}
      <motion.div 
        className="absolute top-10 right-10 md:top-16 md:right-16 transform-gpu"
        style={{ opacity: moonOpacity, scale: moonScale }}
      >
        <motion.div
          className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-gray-200/70 to-gray-300/50 shadow-[0_0_40px_rgba(255,255,255,0.2)]" // Tamaño y brillo aumentados significativamente
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.7, 0.85, 0.7],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Añadimos detalles a la luna */}
        <motion.div className="absolute top-1/4 left-1/4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400/20 blur-sm"></motion.div>
        <motion.div className="absolute bottom-1/3 right-1/4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-400/15 blur-sm"></motion.div>
      </motion.div>

      {/* Nubes ajustadas para fondo oscuro con reacción al scroll */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{...cloud.style, opacity: cloudOpacity}}
          animate={cloud.animate}
          transition={cloud.transition}
        >
          <Cloud className="w-full h-full text-gray-300/40" strokeWidth={0.4} />
        </motion.div>
      ))}

      {/* Aviones distribuidos por toda la pantalla con reacción al scroll */}
      {planes.map((plane) => (
        <motion.div
          key={plane.id}
          className="absolute"
          style={{...plane.style, opacity: planeOpacity}}
          animate={plane.animate}
          transition={plane.transition}
        >
          <Plane className="w-10 h-10 text-gray-200/90" /> {/* Tamaño y opacidad aumentados */}
        </motion.div>
      ))}
      
      {/* Estrellas dinámicas */}
      <Stars />
    </div>
  );
};

// Componente de estrellas parpadeantes para mejorar el fondo
const Stars = () => {
  const [stars, setStars] = useState<StarState[]>([]);
  
  useEffect(() => {
    const starCount = window.innerWidth < 768 ? 50 : 100;
    const newStars = [...Array(starCount)].map((_, i) => ({
      id: `star-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }));
    
    setStars(newStars);
  }, []);
  
  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </>
  );
};

// Componente de texto con efecto de máquina de escribir
const TypewriterText = ({ texts, sequenceDelay = 2500, typingSpeed = 50, deletingSpeed = 30, className = "", charClassName = "" }: { texts: string[]; sequenceDelay?: number; typingSpeed?: number; deletingSpeed?: number; className?: string; charClassName?: string }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || texts.length === 0) return;
    const currentText = texts[textIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => setDisplayText((prev) => prev.slice(0, -1)), deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    } else {
      if (displayText.length < currentText.length) {
        timeoutId = setTimeout(() => setDisplayText((prev) => currentText.slice(0, prev.length + 1)), typingSpeed);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), sequenceDelay);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, sequenceDelay, isClient]);

  if (!isClient && texts.length > 0) {
    return (
      <span className={`${className} ${charClassName}`}>
        {texts[0]}
        <span className="inline-block w-1 h-[1em] animate-pulse bg-current ml-0.5 opacity-70"></span>
      </span>
    );
  }

  return (
    <span className={`${className} ${charClassName}`}>
      {displayText}
      {((!isDeleting && displayText.length === texts[textIndex]?.length) || (isDeleting && displayText.length > 0) || (!isDeleting && displayText.length < texts[textIndex]?.length)) && (
        <motion.span
          className="inline-block w-0.5 h-[0.9em] ml-0.5 bg-current opacity-80"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
        />
      )}
    </span>
  );
};

// Componente principal Hero
export default function Hero() {
  const [showProviders, setShowProviders] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { loginWithProvider, isLoading: isZkLoginLoading, error: zkLoginError } = useZkLogin();
  
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.8]);
  const logoOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  const { currentWallet, connectionStatus } = useCurrentWallet();
  const account: WalletAccount | undefined = currentWallet?.accounts?.[0];
  const isWalletConnected = connectionStatus === 'connected';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isWalletConnected && account) {
      console.log("Sui Wallet conectada en Hero:", account.address);
      // TODO: Lógica de backend para registrar/loguear con account.address
    }
  }, [isWalletConnected, account]);

  const heroTextsMain = ["Discover Paradise.", "Explore New Horizons.", "Adventure Awaits."];
  const cryptoTextsSub = ["Pay with Crypto.", "Powered by SUI.", "Web3 Travel, Simplified."];

  // Efecto de scroll para cambiar opacidad de elementos
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const scrollPos = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollRatio = Math.min(scrollPos / (heroHeight * 0.8), 1);
      
      // Puedes usar estos valores para modificar elementos según el scroll
      console.log("Scroll ratio:", scrollRatio);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) {
    return (
      <div id="hero-section" className="relative h-screen w-full overflow-hidden bg-slate-950 flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10">
          <div className="h-36 w-36 sm:h-40 sm:w-40 rounded-full bg-white/10 animate-pulse mx-auto mb-5"></div>
          <div className="h-10 w-3/4 max-w-lg bg-white/5 rounded animate-pulse mb-3 mx-auto"></div>
          <div className="h-8 w-1/2 max-w-md bg-white/5 rounded animate-pulse mb-5 mx-auto"></div>
          <div className="h-5 w-2/3 max-w-xl bg-white/5 rounded animate-pulse mb-8 mx-auto"></div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="h-11 w-48 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-11 w-48 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="hero-section" 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-slate-950"
    >
      <AnimatedTravelBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10 pt-6 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ opacity: textOpacity }}
          className="w-full max-w-xl md:max-w-2xl"
        >
          {/* Logo mucho más grande e integrado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ scale: logoScale, opacity: logoOpacity }}
            className="mb-6 md:mb-8"
          >
            <div className="inline-block cursor-default group w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto relative">
              {/* Aura alrededor del logo */}
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 30px rgba(255,255,255,0.2)', '0 0 50px rgba(255,255,255,0.3)', '0 0 30px rgba(255,255,255,0.2)'] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 rounded-full backdrop-blur-sm bg-white/5 z-0"
              />

              {/* Anillo luminoso animado */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/20 z-10"
                animate={{ 
                  scale: [1, 1.05, 1], 
                  opacity: [0.4, 0.7, 0.4],
                  boxShadow: ['0 0 10px rgba(255,255,255,0.1)', '0 0 20px rgba(255,255,255,0.2)', '0 0 10px rgba(255,255,255,0.1)']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="w-full h-full flex items-center justify-center relative z-20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
              
              </motion.div>
              
              {/* Partículas flotantes alrededor del logo */}
              <OrbitalParticles />
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 leading-tight tracking-tighter text-white min-h-[2.5em] md:min-h-[2.8em]">
            <TypewriterText
              texts={heroTextsMain}
              className="block"
              charClassName="drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]"
              typingSpeed={55}
              deletingSpeed={30}
              sequenceDelay={2800}
            />
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-gray-200/90 min-h-[1.5em] md:min-h-[1.8em]">
            <TypewriterText
              texts={cryptoTextsSub}
              className="block"
              charClassName="drop-shadow-[0_0_2px_rgba(255,255,255,0.25)]"
              typingSpeed={50}
              deletingSpeed={25}
              sequenceDelay={2600}
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base text-gray-300/80 mb-8 max-w-md mx-auto"
          >
            Book your next adventure with SUI and other cryptos. Easy sign-in with zkLogin or your Sui Wallet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center space-y-3 w-full max-w-xs mx-auto"
          >
            {isMounted && (
               <div className="w-full"> {/* Contenedor para el botón de wallet */}
               <ConnectButton 
                  connectText="Connect Sui Wallet"
                  // El ConnectButton por defecto muestra la dirección acortada cuando está conectado
                  // y maneja sus propios errores de conexión internamente.
                  className="!font-semibold !w-full !text-xs !sm:text-sm !py-3 !px-5 !rounded-md !transition-all !duration-300 !shadow-lg 
                             !bg-sky-500/80 !hover:!bg-sky-600/90 !text-white !border !border-sky-300/40 !hover:!border-sky-200
                             !dark:!bg-blue-600/70 !dark:hover:!bg-blue-700/80 !dark:text-sky-100 !dark:border-blue-400/40 !dark:hover:!border-sky-300"
               />
               {/* Si connectionStatus es 'disconnected' y hubo un error persistente que quieras mostrar globalmente: */}
               {/* {connectionStatus === 'disconnected' && currentWallet === null && <p className="text-red-400 text-xs mt-1">Failed to connect. Is your Sui Wallet active?</p>} */}
            </div>
            )}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0px 0px 20px rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full bg-white/15 backdrop-blur-sm text-white font-semibold py-3 px-5 rounded-md text-xs sm:text-sm shadow-md border border-white/25 hover:bg-white/25 transition-all duration-300 group"
              onClick={() => setShowProviders(!showProviders)}
            >
              <div className="relative flex items-center justify-center gap-1">
                {showProviders ? "Hide Social Logins" : "Login with Social"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${showProviders ? "rotate-180" : ""}`}
                />
              </div>
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {showProviders && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "circOut" }}
                className="mt-4 p-3 w-full max-w-xs mx-auto"
              >
                <motion.div
                  variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col space-y-2"
                >
                 {[ // Asegúrate de que el tipo 'SupportedProvider' esté definido/importado
                    { name: "Google", providerKey: "google" as SupportedProvider, icon: <Chrome />, color: "text-red-400", hoverBg: "hover:bg-red-500/20", borderColor: "border-red-400/30" }, 
                    { name: "Facebook", providerKey: "facebook" as SupportedProvider, icon: <Facebook />, color: "text-blue-400", hoverBg: "hover:bg-blue-500/20", borderColor: "border-blue-400/30" }, 
                    { name: "Twitch", providerKey: "twitch" as SupportedProvider, icon: <Twitch />, color: "text-purple-400", hoverBg: "hover:bg-purple-500/20", borderColor: "border-purple-400/30" }
                  ].map((providerItem) => (
                    <motion.button 
                      key={providerItem.name}
                      variants={{ hidden: { opacity: 0, x: -7 }, show: { opacity: 1, x: 0 } }}
                      whileHover={{ y: -1, scale: 1.015 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14 }}
                      className={`w-full flex items-center justify-center gap-1.5 bg-slate-800/60 ${providerItem.hoverBg} ${providerItem.color} py-2.5 px-4 rounded-md transition-all text-[11px] sm:text-xs border ${providerItem.borderColor} font-medium
                                 ${isZkLoginLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`} // Estilo cuando está cargando
                      onClick={() => {
                        if (!isZkLoginLoading) {
                          loginWithProvider(providerItem.providerKey); // <--- LLAMADA A LA FUNCIÓN DEL HOOK
                        }
                      }}
                      disabled={isZkLoginLoading} // Deshabilitar si está cargando
                    >
                      {isZkLoginLoading ? (
                        <span className="text-xs text-slate-300">Processing...</span>
                      ) : (
                        <>
                          <motion.div className={`${providerItem.color}`}>
                            {React.cloneElement(providerItem.icon, { className: "w-3.5 h-3.5"})}
                          </motion.div>
                          Login with {providerItem.name}
                        </>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
                {/* Mostrar error de zkLogin si existe */}
                {isMounted && zkLoginError && (
                  <p className="text-red-500 text-xs mt-2 px-1 text-center">
                    Error: {zkLoginError}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="absolute bottom-6 sm:bottom-7 left-1/2 transform -translate-x-1/2 cursor-pointer group"
          onClick={() => {
            // Implementación del scroll suave
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
            className="flex flex-col items-center text-white/60 group-hover:text-white/90 transition-colors duration-300"
          >
            <div className="relative h-12 w-6 sm:h-14 sm:w-7 border-2 border-white/30 group-hover:border-white/50 rounded-full p-0.5 backdrop-blur-sm bg-black/30 transition-colors duration-300 shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <motion.div
                className="w-full h-2 rounded-full bg-white/80"
                animate={{ y: ["5px", "22px", "5px"], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[8px] sm:text-[9px] font-light mt-2 opacity-60 group-hover:opacity-90 tracking-wider transition-opacity">
              SCROLL
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Partículas orbitando alrededor del logo
const OrbitalParticles = () => {
  const particles = 10;
  return (
    <>
      {[...Array(particles)].map((_, index) => {
        const delay = index * (5 / particles);
        const size = Math.random() * 4 + 2;
        const speed = 10 + Math.random() * 10;
        
        return (
          <motion.div
            key={`particle-${index}`}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
              boxShadow: [
                '0 0 0px rgba(255,255,255,0)',
                '0 0 8px rgba(255,255,255,0.5)',
                '0 0 0px rgba(255,255,255,0)'
              ],
              rotate: [0, 360],
            }}
            transition={{
              duration: speed,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </>
  );
};

// Definiciones de tipos
interface AnimatedElementStyle extends React.CSSProperties {
  willChange?: string;
}

interface CloudState {
  id: string;
  style: AnimatedElementStyle & { top: string; left: string; opacity: number; filter: string; zIndex: number };
  animate: TargetAndTransition;
  transition: Transition;
}

interface PlaneState {
  id: string;
  style: AnimatedElementStyle;
  animate: TargetAndTransition;
  transition: { x: Transition; y: Transition };
}

interface StarState {
  id: string;
  top: string;
  left: string;
  size: string;
  delay: number;
  duration: number;
}