"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Twitter, Facebook, Instagram, Linkedin, Github, ChevronDown } from "lucide-react";

export default function Footer() {
  const [language, setLanguage] = useState("English");
  const [showLanguages, setShowLanguages] = useState(false);
  
  const languages = ["English", "Español", "中文", "日本語", "Français", "Deutsch"];
  
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog", "Contact"]
    },
    {
      title: "Support",
      links: ["Help Center", "Safety Center", "Community Guidelines"]
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Crypto Disclaimer"]
    },
    {
      title: "Crypto",
      links: ["Supported Tokens", "SUI Integration", "zkLogin FAQ", "Blockchain Transparency"]
    }
  ];
  
  const socialLinks = [
    { name: "Twitter", icon: <Twitter className="h-5 w-5" /> },
    { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
    { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { name: "GitHub", icon: <Github className="h-5 w-5" /> }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              {/* Logo Placeholder */}
              <div className="w-10 h-10 bg-teal-500 rounded-lg mr-3 flex items-center justify-center">
                <span className="font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-2xl">TokenTrip</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your crypto passport to unforgettable experiences. Book flights, hotels, and unique experiences 
              globally using cryptocurrencies, with seamless zkLogin integration.
            </p>
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="flex items-center justify-between w-full md:w-48 p-2 border border-gray-700 rounded-lg"
                onClick={() => setShowLanguages(!showLanguages)}
              >
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  <span>{language}</span>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${showLanguages ? "rotate-180" : ""}`} />
              </button>
              
              {showLanguages && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute w-full md:w-48 mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className={`w-full text-left p-2 hover:bg-gray-700 transition-colors ${
                        lang === language ? "bg-gray-700" : ""
                      }`}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguages(false);
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Links Columns */}
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-teal-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer Bottom - Social & Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
          
          <div className="text-gray-500 text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} TokenTrip. All rights reserved.</p>
            <p className="text-sm mt-1">Powered by SUI blockchain with zkLogin technology.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}