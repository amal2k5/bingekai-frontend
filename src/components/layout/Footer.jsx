import { Github, Linkedin, Instagram, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Watchlist", path: "/watchlist" },
    { name: "Activity", path: "/activity" },
    { name: "My Lists", path: "/lists" },
  ];

  const discoverLinks = [
    { name: "Trending", path: "/movies?category=trending" },
    { name: "Top Rated", path: "/movies?category=top-rated" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "Users", path: "/users" },
    { name: "Feed", path: "/feed" },
  ];

  const socialLinks = [
    {
      icon: <Github size={18} />,
      href: "https://github.com/yourusername",
    },
    {
      icon: <Linkedin size={18} />,
      href: "https://linkedin.com/in/yourusername",
    },
    {
      icon: <Instagram size={18} />,
      href: "https://instagram.com/yourusername",
    },
  ];

  return (
    <footer className="bg-black border-t border-white/5 text-zinc-500">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Clapperboard size={20} />

              <span className="font-semibold tracking-tight text-lg">
                BingeKai
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm text-zinc-500">
              A modern movie discovery and social platform to track,
              review, rate, and explore cinema.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">
              Navigation
            </h3>

            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">
              Discover
            </h3>

            <ul className="space-y-3">
              {discoverLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-5">

          {/* Socials */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-600 text-center">
            © {currentYear} BingeKai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}