import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const imgRef = useRef(null);

  useEffect(() => {
    let simpleParallax;
    async function initParallax() {
      const { default: SimpleParallax } = await import('simple-parallax-js');
      if (imgRef.current) {
        simpleParallax = new SimpleParallax(imgRef.current, {
          scale: 1.4,
          delay: 0.4,
          transition: 'cubic-bezier(0,0,0,1)',
        });
      }
    }
    initParallax();
    return () => simpleParallax?.destroy?.();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.22, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const tagline = "Feliz cumpleaños, amor.";
  const subtitle = "Te hice un pequeño lugar donde viven pedacitos nuestros.";

  return (
    <section className="hero-section">
      {/* Hero image with parallax */}
      <div className="hero-image-wrap">
        <div className="hero-image-overlay" />
        <img
          ref={imgRef}
          src="/hero_galaxy.png"
          alt="Nosotros"
          className="hero-img"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback gradient background */}
        <div className="hero-gradient-bg" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          className="hero-inner"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={itemVariants} className="hero-eyebrow">
            ✦ 26 de Mayo ✦
          </motion.span>

          <motion.h1 variants={itemVariants} className="hero-title">
            {tagline}
          </motion.h1>

          <motion.div variants={itemVariants} className="hero-divider" />

          <motion.p variants={itemVariants} className="hero-subtitle">
            {subtitle}
          </motion.p>

          <motion.div variants={itemVariants}>
            <a href="/recuerdos" className="btn-primary hero-btn">
              <span>Entrar al universo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-nav-links">
            {[
              ['Recuerdos', '/recuerdos'],
              ['Cartas', '/cartas'],
              ['Razones', '/razones'],
              ['Sueños', '/suenos'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="hero-nav-item">
                {label}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        @keyframes cosmic-drift {
          0% { transform: scale(1) translate(0, 0) rotate(0deg); }
          33% { transform: scale(1.05) translate(1%, 1%) rotate(1deg); }
          66% { transform: scale(1.02) translate(-1%, 0.5%) rotate(-0.5deg); }
          100% { transform: scale(1) translate(0, 0) rotate(0deg); }
        }

        .hero-image-wrap {
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          z-index: 0;
          animation: cosmic-drift 40s ease-in-out infinite;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-gradient-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: radial-gradient(ellipse at center, #1a0d2e 0%, #08060f 70%);
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to bottom,
            rgba(8,6,15,0.3) 0%,
            rgba(8,6,15,0.1) 40%,
            rgba(8,6,15,0.7) 80%,
            rgba(8,6,15,1) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .hero-eyebrow {
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-rose-warm);
          font-family: var(--font-body);
          font-weight: 500;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 6vw, 4rem);
          font-weight: 600;
          color: var(--color-cream);
          line-height: 1.15;
          text-shadow: 0 2px 30px rgba(0,0,0,0.5);
        }

        .hero-divider {
          width: 50px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-rose-warm), transparent);
        }

        .hero-subtitle {
          font-family: var(--font-script);
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: var(--color-cream-dim);
          max-width: 520px;
          line-height: 1.6;
        }

        .hero-btn {
          margin-top: 0.5rem;
          font-size: 1rem;
          padding: 1rem 2.5rem;
        }

        .hero-nav-links {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-nav-item {
          color: var(--color-muted);
          text-decoration: none;
          font-size: 0.825rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          transition: color 0.2s;
        }

        .hero-nav-item:hover { color: var(--color-cream); }

        .scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          color: var(--color-muted);
          opacity: 0.6;
        }

        @media (max-width: 600px) {
          .hero-nav-links { gap: 1.2rem; }
        }
      `}</style>
    </section>
  );
}
