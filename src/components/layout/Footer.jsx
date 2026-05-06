import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  Clapperboard,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Navigation: ["Home", "Movies", "Watchlist"],
    Discover: ["Trending", "Top Rated", "Upcoming"],
    Support: ["Privacy Policy", "Terms", "Contact Us"],
  };

  const socialLinks = [
    { icon: <Github size={18} />, href: "#" },
    { icon: <Linkedin size={18} />, href: "#" },
    { icon: <Instagram size={18} />, href: "#" },
    { icon: <Mail size={18} />, href: "mailto:connectbingekai@gmail.com" },
  ];

  return (
    <footer className="bg-black border-t border-white/5 text-zinc-500">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-zinc-300">
              <Clapperboard size={20} />
              <span className="font-bold tracking-tight">BingeKai</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              A modern movie discovery platform for film lovers. 
              Track, review, and explore cinema.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs hover:text-zinc-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
          
          {/* Socials */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                className="hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[10px] font-mono tracking-widest uppercase">
            © {currentYear} BingeKai — All rights reserved
          </p>

        </div>
      </div>
    </footer>
  );
}