import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import VariableProximity from "../components/VariableProximity";
import { getTrendingMovies } from "../api/movieApi";
import { useNavigate } from "react-router-dom";

const slides = [
  { image: "/frames/bee.jpg", title: "Bumble Bee" },
  { image: "/frames/matrix.jpg", title: "Matrix" },
  { image: "/frames/loki.jpg", title: "Loki" },
  { image: "/frames/kaththi.jpg", title: "Kaththi" },
  { image: "/frames/wednesday.jpg", title: "Wednesday" },
  { image: "/frames/avatar.jpg", title: "Avatar" },
  { image: "/frames/baahubali.jpg", title: "Baahubali" },
  { image: "/frames/peacemaker.jpg", title: "Peacemaker" },
  { image: "/frames/spider.jpg", title: "Spider-Man" },
  { image: "/frames/sita.jpg", title: "Sita Ramam" },
  { image: "/frames/kill.jpg", title: "They Will Kill You" },
  { image: "/frames/panda.jpg", title: "Kung Fu Panda" },
  { image: "/frames/premalu.jpg", title: "Premalu" },
];

function Home() {
  const [index, setIndex] = useState(0);
  const [movies, setMovies] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    getTrendingMovies()
      .then((data) => {
        setMovies(data.results || []);
      })
      .catch((err) => console.error(err));

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div
        ref={containerRef}
        className="relative h-screen w-full bg-black text-white overflow-hidden"
      >
        {/* IMAGE SLIDER */}
        <AnimatePresence mode="popLayout">
          <motion.div className="absolute inset-0">
            {slides.map((slide, i) => {
              const isActive = i === index;

              return (
                <motion.img
                  key={slide.image}
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center select-none"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1.01 : 1.03,
                  }}
                  transition={{
                    opacity: { duration: 1.2, ease: "easeInOut" },
                    scale: { duration: 8, ease: "linear" },
                  }}
                  style={{
                    imageRendering: "auto",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                  }}
                />
              );
            })}

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none flex items-center gap-3"
          >
            <VariableProximity
              label="BINGE"
              containerRef={containerRef}
              radius={140}
              falloff="linear"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              className="text-white font-black"
              style={{
                textShadow: `
                  1px 1px 0px #444, 
                  2px 2px 0px #333, 
                  3px 3px 0px #222, 
                  4px 4px 0px #111, 
                  5px 5px 0px #000,
                  6px 6px 12px rgba(0,0,0,0.6)`,
              }}
            />

            <VariableProximity
              label="KAI"
              containerRef={containerRef}
              radius={140}
              falloff="linear"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              className="text-[#39FF14] font-black"
              style={{
                textShadow: `
                  1px 1px 0px #22c55e, 
                  2px 2px 0px #166534, 
                  3px 3px 0px #166534, 
                  4px 4px 0px #064e3b, 
                  5px 5px 10px rgba(0,0,0,0.8)`,
              }}
            />
          </motion.h1>

          {/* TAGLINE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mt-6 text-lg text-gray-300 leading-relaxed"
          >
            Discover, track and review the films that shape your cinematic
            universe.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mt-8 flex-wrap items-center"
          >
            {/* Explore */}
            <motion.button
              onClick={() => navigate("/movies")}
              whileHover={{ scale: 1.03, backgroundColor: "#22c55e" }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-1.5 bg-green-500 text-black text-sm font-medium rounded-full transition shadow-md shadow-green-500/15"
            >
              Explore Movies
            </motion.button>

            {/* Recommendation */}
            <motion.button
              onClick={() => navigate("/recommendations")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-sm font-medium rounded-full shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <span>For You</span>
            </motion.button>

            {/* Activity */}
            <motion.button
              onClick={() => navigate("/feed")}
              whileHover={{
                scale: 1.03,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.1)",
              }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-1.5 border border-white/20 text-white/80 text-sm font-medium rounded-full transition backdrop-blur-sm hover:text-white"
            >
              Latest Activity
            </motion.button>
          </motion.div>

          {/* CURRENT MOVIE TITLE */}
          <motion.p
            key={slides[index].title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-12 text-sm tracking-wide text-gray-400"
          >
            Now Featuring — {slides[index].title}
          </motion.p>
        </div>

        {/* SLIDE INDICATORS */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              animate={{
                width: i === index ? 40 : 20,
                opacity: i === index ? 1 : 0.4,
              }}
              className={`h-0.75 rounded-full ${
                i === index ? "bg-green-500" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
