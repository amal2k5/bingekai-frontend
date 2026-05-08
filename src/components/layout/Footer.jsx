import { Github, Linkedin, Instagram, Clapperboard, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Community", path: "/community" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms", path: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Github size={18} />, href: "#", label: "GitHub" },
    { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-colors">
                <Clapperboard size={22} className="text-white" />
              </div>
              <span className="font-bold tracking-tight text-xl text-white">
                BingeKai
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-8">
              The definitive platform for cinema enthusiasts. Track your journey, 
              discover hidden gems, and connect with a global community of film lovers.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-zinc-200 text-[11px] uppercase tracking-[0.2em] font-bold mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-zinc-400 text-sm hover:text-white transition-colors duration-200 block"
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
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-[12px]">
            © {currentYear} BingeKai Inc. Built for the love of cinema.
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400 text-[12px]">Systems Operational</span>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-zinc-400 hover:text-white text-[12px] transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}