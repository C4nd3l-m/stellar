import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export default function Timeline({ memories = [] }) {
  const containerRef = useRef(null);
  const [mapBounds, setMapBounds] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Tamaño del universo. Más compacto en móvil para no perderse tanto.
  const MAP_WIDTH = isMobile ? 1800 : 3000;
  const MAP_HEIGHT = isMobile ? 1800 : 2000;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sorted = [...memories].sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  const planets = useMemo(() => {
    const rng = mulberry32(12345); 
    
    return sorted.map((memory, i) => {
      const progress = i / Math.max(1, sorted.length - 1); 
      
      // Ajustamos los márgenes (15 a 85) para evitar que se corten en los bordes
      const baseXPct = 20 + (progress * 60); 
      const noiseX = (rng() - 0.5) * 15;
      
      const baseYPct = 50 + Math.sin(progress * Math.PI * 3) * 20;
      const noiseY = (rng() - 0.5) * 20;

      const hues = [280, 320, 350, 20, 40, 200, 240];
      const hue = hues[Math.floor(rng() * hues.length)];

      return {
        ...memory,
        x: Math.max(15, Math.min(85, baseXPct + noiseX)), 
        y: Math.max(20, Math.min(80, baseYPct + noiseY)), 
        size: isMobile ? 60 + rng() * 40 : 80 + rng() * 60, // Más chicos en móvil
        color: `hsl(${hue}, 80%, 65%)`,
        delay: rng() * 2
      };
    });
  }, [sorted, isMobile]);

  const backgroundStars = useMemo(() => {
    const rng = mulberry32(999);
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 3 + 1,
      opacity: rng() * 0.7 + 0.1,
      twinkleSpeed: rng() * 3 + 2
    }));
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const updateBounds = () => {
        const viewport = containerRef.current.getBoundingClientRect();
        setMapBounds({
          top: -(MAP_HEIGHT - viewport.height),
          left: -(MAP_WIDTH - viewport.width),
          right: 0,
          bottom: 0
        });
      };
      
      // Delay for mobile to ensure accurate height
      setTimeout(updateBounds, 100);
      window.addEventListener('resize', updateBounds);
      return () => window.removeEventListener('resize', updateBounds);
    }
  }, [MAP_WIDTH, MAP_HEIGHT]);

  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);

  return (
    <section className="universe-section" id="recuerdos">
      <div className="universe-ui-overlay">
        <span className="eyebrow">Mapa Estelar</span>
        <h2 className="universe-title">Explorá nuestro universo</h2>
        <p className="universe-instruction">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M19 9l3 3-3 3"/><path d="M9 19l3 3 3-3"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
          Arrastrá el espacio para explorar
        </p>
      </div>

      <div className="universe-viewport" ref={containerRef}>
        <motion.div
          className="universe-canvas"
          drag
          dragConstraints={mapBounds}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          style={{ width: MAP_WIDTH, height: MAP_HEIGHT, x: mapX, y: mapY }}
          whileTap={{ cursor: "grabbing" }}
          initial={{ x: mapBounds.left / 2, y: mapBounds.top / 2 }}
        >
          {/* Fondo Estrellas Lento */}
          <motion.div 
            className="universe-bg"
            style={{ 
              x: useSpring(useMotionValue(0), { damping: 50, stiffness: 10 }), 
              y: useSpring(useMotionValue(0), { damping: 50, stiffness: 10 }) 
            }}
          >
            {backgroundStars.map(star => (
              <div 
                key={star.id} 
                className="bg-star"
                style={{
                  left: `${star.x}%`, top: `${star.y}%`,
                  width: star.size, height: star.size,
                  opacity: star.opacity,
                  animation: `twinkle ${star.twinkleSpeed}s infinite alternate`
                }}
              />
            ))}
          </motion.div>

          <svg className="constellation-lines">
            <polyline 
              points={planets.map(p => `${(p.x * MAP_WIDTH) / 100},${(p.y * MAP_HEIGHT) / 100}`).join(' ')} 
              fill="none" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {planets.map((planet, i) => (
            <motion.div
              key={planet.slug}
              className="planet-wrapper"
              style={{
                left: `${planet.x}%`,
                top: `${planet.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "200px" }}
              transition={{ delay: 0.2 + (Math.random() * 0.3), type: "spring", bounce: 0.5 }}
            >
              <a href={`/recuerdos/${planet.slug}`} className="planet-link">
                
                <motion.div 
                  className="planet-glow"
                  style={{ backgroundColor: planet.color }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ duration: 3 + planet.delay, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div 
                  className="planet-core"
                  style={{ 
                    width: planet.size, 
                    height: planet.size,
                    boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.6), 0 0 20px ${planet.color}`
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {planet.data.cover ? (
                     planet.data.cover.endsWith('.mp4') ? (
                      <video src={planet.data.cover} autoPlay muted loop playsInline className="planet-texture" />
                    ) : (
                      <img src={planet.data.cover} alt={planet.data.title} className="planet-texture" />
                    )
                  ) : (
                    <div className="planet-emoji">{planet.data.emoji}</div>
                  )}
                  <div className="planet-atmosphere" style={{ background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%, ${planet.color})` }} />
                </motion.div>

                {/* Etiqueta permanente para móviles, tooltip detallado para desktop */}
                <div className="planet-permanent-label">
                  {planet.data.title}
                </div>

                <div className="planet-tooltip">
                  <div className="tooltip-line" />
                  <div className="tooltip-content">
                    {planet.data.date && <span className="tooltip-date">{planet.data.date}</span>}
                    <h3 className="tooltip-title">{planet.data.title}</h3>
                    <span className="tooltip-action">Entrar a la memoria</span>
                  </div>
                </div>

              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .universe-section { 
          position: relative;
          height: 85vh;
          min-height: 500px;
          background: radial-gradient(circle at center, #130c24 0%, #07050d 100%);
          overflow: hidden;
          border-radius: 24px;
          margin: 4rem 1rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 80px rgba(42,31,69,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .universe-ui-overlay {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 2rem 1rem;
          text-align: center;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(7,5,13,0.9) 0%, rgba(7,5,13,0) 100%);
        }

        .eyebrow {
          display: block; font-size: 0.8rem; letter-spacing: 0.3em; text-transform: uppercase; 
          color: var(--color-rose-warm); margin-bottom: 0.5rem; 
          text-shadow: 0 0 10px rgba(232,133,106,0.6);
          font-weight: bold;
        }

        .universe-title {
          font-family: var(--font-display); font-size: clamp(1.8rem, 5vw, 3rem); 
          color: white; margin-bottom: 1rem;
          text-shadow: 0 4px 15px rgba(0,0,0,0.8);
          line-height: 1.1;
        }

        .universe-instruction {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 30px;
          color: rgba(255,255,255,0.9);
          font-size: 0.85rem;
          border: 1px solid rgba(255,255,255,0.2);
          animation: pulse-soft 2s infinite;
        }

        @keyframes pulse-soft {
          0%, 100% { box-shadow: 0 0 0 rgba(232,133,106,0); }
          50% { box-shadow: 0 0 20px rgba(232,133,106,0.4); border-color: rgba(232,133,106,0.6); }
        }

        .universe-viewport {
          position: absolute;
          inset: 0;
          cursor: grab;
          touch-action: none; /* Previene scroll nativo al arrastrar */
        }
        
        .universe-viewport:active {
          cursor: grabbing;
        }

        .universe-canvas {
          position: absolute;
          will-change: transform;
        }

        .universe-bg {
          position: absolute;
          inset: -30%; 
          width: 160%;
          height: 160%;
          pointer-events: none;
        }

        .bg-star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 8px white;
        }

        @keyframes twinkle {
          0% { transform: scale(0.6); opacity: 0.2; }
          100% { transform: scale(1.1); opacity: 1; }
        }

        .constellation-lines {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.8;
          filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
        }

        .planet-wrapper {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 5;
        }

        .planet-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          text-decoration: none;
        }

        .planet-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 180%; height: 180%;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }

        .planet-core {
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          background: #111;
        }

        .planet-texture {
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          object-fit: cover;
          filter: contrast(1.1) saturate(1.2);
        }

        .planet-emoji {
          font-size: clamp(2rem, 4vw, 3rem);
          position: relative;
          z-index: 2;
        }

        .planet-atmosphere {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 3;
        }

        .planet-permanent-label {
          margin-top: 1rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
          background: rgba(0,0,0,0.5);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.1);
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          pointer-events: none;
          z-index: 2;
        }

        /* Tooltip interactivo (Solo en Desktop) */
        .planet-tooltip {
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translateY(-50%) translateX(15px);
          width: max-content;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          z-index: 10;
        }

        @media (hover: hover) {
          .planet-link:hover .planet-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(25px);
          }
          
          .planet-link:hover .planet-permanent-label {
            opacity: 0;
          }
        }

        .tooltip-line {
          position: absolute;
          top: 50%;
          left: -25px;
          width: 25px;
          height: 2px;
          background: rgba(255,255,255,0.5);
        }

        .tooltip-content {
          background: rgba(15, 11, 28, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(232,133,106,0.15);
        }

        .tooltip-date {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--color-rose-warm);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          font-weight: bold;
        }

        .tooltip-title {
          color: white;
          font-family: var(--font-display);
          font-size: 1.3rem;
          margin-bottom: 0.6rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .tooltip-action {
          display: inline-block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          border-bottom: 1px solid rgba(255,255,255,0.3);
          padding-bottom: 2px;
        }

        /* Optimizaciones Mobile */
        @media (max-width: 768px) {
          .universe-section { 
            height: 70vh; 
            margin: 1.5rem 0.5rem; 
            border-radius: 16px;
          }
          
          .universe-ui-overlay {
            padding: 1.5rem 1rem;
          }
          
          .planet-tooltip {
            display: none; /* En celular usamos el label permanente debajo */
          }
          
          .planet-permanent-label {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
            margin-top: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}
