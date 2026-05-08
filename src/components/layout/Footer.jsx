import { Github, Linkedin, Instagram, Clapperboard } from "lucide-react";
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
  ];

  const socialLinks = [
    { icon: <Github size={18} />, href: "#", label: "GitHub" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-[#050505] pt-20 pb-10 overflow-hidden">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="p-1.5 bg-zinc-900/50 rounded-lg group-hover:bg-zinc-800/50 transition-colors">
                <Clapperboard size={20} className="text-white" />
              </div>
              <span className="font-medium tracking-tight text-white text-lg">
                BingeKai
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
              The definitive platform for cinema enthusiasts. Track your journey, 
              discover hidden gems, and connect with a global community of film lovers.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] mb-5">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors duration-200"
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
        <div className="pt-6 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">
            © {currentYear} BingeKai. Built for the love of cinema.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              <span className="text-zinc-600 text-xs">All systems operational</span>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}