// src/components/layout/Footer.jsx

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  Clapperboard,
  Heart,
  TrendingUp,
  Film,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const y = useTransform(scrollYProgress, [0.7, 0.9], [50, 0]);

  const footerLinks = {
    Navigation: ["Home", "Movies", "Watchlist", "Activity", "Custom Lists"],
    Discover: ["Trending", "Top Rated", "Upcoming", "Now Playing", "Genres"],
    Support: ["Help Center", "Privacy Policy", "Terms of Service", "Contact Us", "Report Issue"],
  };

  const socialLinks = [
    { icon: <Github size={18} />, href: "#", label: "GitHub", color: "hover:border-gray-400/40 hover:bg-gray-500/10" },
    { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn", color: "hover:border-blue-500/40 hover:bg-blue-500/10" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram", color: "hover:border-pink-500/40 hover:bg-pink-500/10" },
    { icon: <Mail size={18} />, href: "#", label: "Email", color: "hover:border-emerald-500/40 hover:bg-emerald-500/10" },
  ];

  const stats = [
    { label: "Movies", value: "10,000+", icon: Film },
    { label: "Users", value: "50,000+", icon: Users },
    { label: "Reviews", value: "100,000+", icon: Star },
    { label: "Trending", value: "Daily", icon: TrendingUp },
  ];

  return (
    <motion.footer 
      style={{ opacity, y }}
      className="relative mt-32 border-t border-white/5 bg-gradient-to-b from-[#070707] via-[#0a0a0a] to-[#050505] overflow-hidden"
    >
      {/* Premium Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/5 to-purple-500/5 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 blur-3xl rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} 
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-20">
        {/* Top Section with Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section - Larger */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl blur-xl opacity-50" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30">
                  <Clapperboard size={24} className="text-white" />
                </div>
              </motion.div>

              <div>
                <motion.h2 
                  className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  BingeKai
                </motion.h2>
                <p className="text-sm text-emerald-400/70 font-mono tracking-wider">
                  PREMIUM CINEMA PLATFORM
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-zinc-500 max-w-sm mb-6">
              A modern movie discovery and social platform built for film lovers.
              Track movies, write reviews, create lists, and explore cinematic
              experiences with a premium interface.
            </p>

            {/* Stats Mini */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-2 text-center"
                >
                  <stat.icon size={12} className="text-emerald-400/60 mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">{stat.value}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {Object.entries(footerLinks).map(([category, links], idx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
                    {category}
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {links.map((item, i) => (
                      <motion.button
                        key={item}
                        whileHover={{ x: 5 }}
                        className="group flex items-center gap-2 text-left text-zinc-500 hover:text-white transition-all duration-300 text-sm"
                      >
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-emerald-400" />
                        <span>{item}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Connect With Us
            </h3>

            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  onHoverStart={() => setHoveredSocial(index)}
                  onHoverEnd={() => setHoveredSocial(null)}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-11 h-11 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-zinc-300 ${social.color} transition-all duration-300 group overflow-hidden`}
                >
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: hoveredSocial === index ? 1 : 0,
                      opacity: hoveredSocial === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">{social.icon}</span>
                  
                  {/* Tooltip */}
                  <motion.div 
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] px-2 py-0.5 rounded text-[9px] font-mono text-white whitespace-nowrap opacity-0 pointer-events-none"
                    animate={{ opacity: hoveredSocial === index ? 1 : 0, y: hoveredSocial === index ? -5 : 0 }}
                  >
                    {social.label}
                  </motion.div>
                </motion.a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={12} className="text-emerald-400" />
                <p className="text-xs font-semibold text-white">Stay Updated</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-[10px] font-black text-black uppercase tracking-wider"
                >
                  Subscribe
                </motion.button>
              </div>
              <p className="text-[9px] text-zinc-600 mt-2">Get weekly movie recommendations</p>
            </div>

            <div className="mt-6 space-y-1.5 text-xs text-zinc-600">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                Built with React, Django & FastAPI
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                Powered by TMDB movie metadata
              </p>
            </div>
          </motion.div>
        </div>

        {/* Premium Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 180 }}
              className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center"
            >
              <Heart size={12} className="text-emerald-400" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p 
            className="text-xs text-zinc-600 font-mono tracking-wider"
            whileHover={{ letterSpacing: "0.1em" }}
          >
            © 2026 BingeKai — All rights reserved
          </motion.p>

          <div className="flex items-center gap-6 text-xs">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"].map((item, idx) => (
              <motion.button
                key={item}
                whileHover={{ y: -1 }}
                className="text-zinc-600 hover:text-white transition-colors duration-300 font-mono tracking-wider"
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* Back to Top Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-zinc-600 hover:text-white transition-colors text-xs font-mono flex items-center gap-1"
          >
            BACK TO TOP
            <ChevronRight size={12} className="rotate-[-90deg]" />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
}