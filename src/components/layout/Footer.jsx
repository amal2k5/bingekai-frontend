import { useEffect } from "react";
import { Github, Linkedin, Instagram, Clapperboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";




export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const sections = [
    {
      title: "Platform",
      links: [
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "Watchlist", path: "/watchlist" },
        { name: "Activity", path: "/activity" },
      ],
    },
    {
      title: "Discover",
      links: [
        { name: "Trending", path: "/movies?category=trending" },
        { name: "Top Rated", path: "/movies?category=top-rated" },
        { name: "Recommendations", path: "/recommendations" },
        { name: "Global Feed", path: "/feed" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Github size={16} />, href: "https://github.com", label: "GitHub" },
    { icon: <Instagram size={16} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin size={16} />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-black/95 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-10">
          
          {/* Brand Section */}
          <div className="lg:w-1/3 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <Clapperboard size={18} className="text-white/70" />
              <span className="text-white/80 text-sm font-medium tracking-tight">
                BingeKai
              </span>
            </Link>
            
            <p className="text-white/35 text-xs leading-relaxed max-w-xs">
              Track your movie journey, discover hidden gems, 
              and connect with cinema lovers worldwide.
            </p>
            
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-white/35 hover:border-white/20 hover:text-white/60 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="flex-1 grid grid-cols-2 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white/40 text-[10px] uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-white/35 text-xs hover:text-white/60 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-[11px] order-2 sm:order-1">
            © {currentYear} BingeKai. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
              <span className="text-white/25 text-[11px]">Operational</span>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white/25 hover:text-white/50 text-[11px] transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}