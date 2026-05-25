import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_PHOTOS = [
  { src: '/images/memories/caraslocas.jpg',    caption: 'Mordiendo la vida juntos',       year: '2022' },
  { src: '/images/memories/caraslocas2.jpg',   caption: 'Caras en el mundo',              year: '2024' },
  { src: '/images/memories/look_invierno.jpg', caption: 'Ese invierno que me enamoré',    year: 'Invierno' },
  { src: '/images/memories/con_gio.jpg',       caption: 'El amor más grande',             year: 'Otoño' },
  { src: '/images/memories/parque.jpg',        caption: 'Nuestro rincón del mundo',       year: 'Otoño' },
  { src: '/images/memories/abrazo.jpg',        caption: 'El abrazo que lo dice todo',     year: '2022' },
  { src: '/images/memories/paseo.jpg',         caption: 'Caminando juntos',               year: '2022' },
  { src: '/images/memories/paseo2.jpg',        caption: 'Otro paseo, otra historia',      year: '2022' },
  { src: '/images/memories/selfie.jpg',        caption: 'Nosotros',                       year: '2022' },
  { src: '/images/memories/navidad.jpg',       caption: 'Nuestra primera Navidad',        year: '2022' },
  { src: '/images/memories/first_kiss.jpg',    caption: 'El primero de muchos',           year: '2021' },
  { src: '/images/memories/mordida.jpg',       caption: 'Nuestro lado salvaje',           year: '2022' },
  { src: '/images/memories/mordida2.jpg',      caption: 'La revancha',                    year: '2022' },
  { src: '/images/memories/anillos_novios.jpg','caption': 'El sí más importante',         year: '2022' },
  { src: '/images/memories/cochino.jpg',       caption: 'Ese que sabe cómo mirarme',      year: '2022' },
  { src: '/images/memories/tattoos.jpg',       caption: 'Marcas que quedan',              year: '2022' },
  { src: '/images/memories/cafe2.jpg',         caption: 'Café, vos y yo',                year: '2022' },
  { src: '/images/memories/paseo4.jpg',        caption: 'Explorando juntos',              year: '2022' },
];

// Deterministic rotation based on index
const ROTATIONS = [-2.5, 1.8, -1.2, 2.1, -0.8, 1.5, -2.0, 0.9, -1.7, 2.4, -0.5, 1.1, -2.8, 0.6, -1.4, 2.2, -0.9, 1.6];

function LightboxModal({ photo, onClose, onPrev, onNext }) {
  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-inner"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <button className="lightbox-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Anterior">‹</button>
        <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Siguiente">›</button>

        <div className="lightbox-img-wrap">
          <img src={photo.src} alt={photo.caption} className="lightbox-img" />
        </div>
        <div className="lightbox-caption">
          <span className="lightbox-year">{photo.year}</span>
          <p className="lightbox-text">{photo.caption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoGallery() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [filter, setFilter] = useState('all');

  const photos = ALL_PHOTOS;

  const open = useCallback((i) => setActiveIdx(i), []);
  const close = useCallback(() => setActiveIdx(null), []);
  const prev = useCallback(() => setActiveIdx(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setActiveIdx(i => (i + 1) % photos.length), [photos.length]);

  const uniqueYears = ['all', ...Array.from(new Set(ALL_PHOTOS.map(p => p.year))).sort()];

  const filtered = filter === 'all' ? photos : photos.filter(p => p.year === filter);

  return (
    <section className="gallery-section">
      <motion.div
        className="gallery-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="gallery-eyebrow">📸 Galería</span>
        <h2 className="gallery-title">Nuestros momentos</h2>
        <div className="gallery-divider" />
        <p className="gallery-subtitle">Cada foto, un universo en sí mismo.</p>
      </motion.div>

      {/* Year filter pills */}
      <div className="filter-row">
        {uniqueYears.map(year => (
          <button
            key={year}
            className={`filter-pill ${filter === year ? 'filter-pill-active' : ''}`}
            onClick={() => setFilter(year)}
          >
            {year === 'all' ? '✦ Todos' : year}
          </button>
        ))}
      </div>

      {/* Polaroid wall */}
      <motion.div className="polaroid-wall" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => {
            const rotation = ROTATIONS[ALL_PHOTOS.indexOf(photo)] ?? 0;
            return (
              <motion.div
                key={photo.src}
                className="polaroid-card"
                initial={{ opacity: 0, scale: 0.8, rotate: rotation * 2 }}
                animate={{ opacity: 1, scale: 1, rotate: rotation }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
                transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                layout
                onClick={() => open(ALL_PHOTOS.indexOf(photo))}
              >
                <div className="polaroid-img-wrap">
                  <img src={photo.src} alt={photo.caption} loading="lazy" className="polaroid-img" />
                  <div className="polaroid-overlay">
                    <span className="polaroid-zoom">🔍</span>
                  </div>
                </div>
                <p className="polaroid-caption">{photo.caption}</p>
                <span className="polaroid-year">{photo.year}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIdx !== null && (
          <LightboxModal
            photo={photos[activeIdx] ?? ALL_PHOTOS[activeIdx]}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>

      <style>{`
        .gallery-section {
          padding: 6rem 1.5rem 8rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .gallery-eyebrow {
          display: block;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-rose-warm);
          margin-bottom: 0.75rem;
          font-weight: 600;
          text-shadow: 0 0 12px rgba(232,133,106,0.5);
        }

        .gallery-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--color-cream);
          margin-bottom: 1rem;
          line-height: 1.15;
        }

        .gallery-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-rose-warm), transparent);
          margin: 1rem auto 1.25rem;
        }

        .gallery-subtitle {
          color: var(--color-muted);
          font-size: 0.95rem;
        }

        /* Filter pills */
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .filter-pill {
          background: rgba(28,22,51,0.6);
          border: 1px solid rgba(184,159,212,0.15);
          color: var(--color-muted);
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          padding: 0.4rem 1rem;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: var(--font-body);
          backdrop-filter: blur(8px);
        }

        .filter-pill:hover {
          border-color: rgba(232,133,106,0.35);
          color: var(--color-cream);
        }

        .filter-pill-active {
          background: rgba(232,133,106,0.12);
          border-color: rgba(232,133,106,0.45);
          color: var(--color-rose-warm);
          box-shadow: 0 0 16px rgba(232,133,106,0.15);
        }

        /* Polaroid wall */
        .polaroid-wall {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 2rem;
          padding: 1rem 0;
        }

        .polaroid-card {
          background: #f8f4ef;
          padding: 10px 10px 40px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.25);
          cursor: pointer;
          position: relative;
          transition: box-shadow 0.3s ease;
        }

        .polaroid-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(232,133,106,0.18);
        }

        .polaroid-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          background: #ddd;
        }

        .polaroid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .polaroid-card:hover .polaroid-img {
          transform: scale(1.05);
        }

        .polaroid-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8,6,15,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .polaroid-card:hover .polaroid-overlay {
          background: rgba(8,6,15,0.35);
        }

        .polaroid-zoom {
          font-size: 1.8rem;
          opacity: 0;
          transition: opacity 0.25s ease;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }

        .polaroid-card:hover .polaroid-zoom {
          opacity: 1;
        }

        .polaroid-caption {
          font-family: 'Dancing Script', cursive;
          font-size: 0.95rem;
          color: #4a3a2a;
          text-align: center;
          margin-top: 0.6rem;
          line-height: 1.3;
          padding: 0 4px;
        }

        .polaroid-year {
          position: absolute;
          bottom: 8px;
          right: 12px;
          font-size: 0.65rem;
          color: #9a8a7a;
          font-family: var(--font-body);
          letter-spacing: 0.08em;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 3, 10, 0.92);
          backdrop-filter: blur(14px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .lightbox-inner {
          position: relative;
          max-width: 680px;
          width: 100%;
          background: rgba(17,13,30,0.95);
          border: 1px solid rgba(184,159,212,0.15);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(232,133,106,0.08);
        }

        .lightbox-img-wrap {
          overflow: hidden;
          max-height: 65vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080612;
        }

        .lightbox-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          max-height: 65vh;
        }

        .lightbox-caption {
          padding: 1.25rem 1.75rem 1.5rem;
          text-align: center;
        }

        .lightbox-year {
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-rose-warm);
          display: block;
          margin-bottom: 0.4rem;
        }

        .lightbox-text {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--color-cream);
          font-style: italic;
        }

        .lightbox-close {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-muted);
          font-size: 0.8rem;
          z-index: 10;
          transition: all 0.2s;
        }

        .lightbox-close:hover {
          background: rgba(232,133,106,0.2);
          color: var(--color-cream);
          border-color: rgba(232,133,106,0.4);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(17,13,30,0.75);
          border: 1px solid rgba(184,159,212,0.15);
          color: var(--color-cream);
          font-size: 2rem;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
          line-height: 1;
          padding-bottom: 2px;
        }

        .lightbox-nav:hover {
          background: rgba(232,133,106,0.15);
          border-color: rgba(232,133,106,0.4);
        }

        .lightbox-prev { left: 0.85rem; }
        .lightbox-next { right: 0.85rem; }

        @media (max-width: 640px) {
          .polaroid-wall {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .gallery-section { padding: 4rem 1rem 6rem; }

          .lightbox-nav { display: none; }
        }
      `}</style>
    </section>
  );
}
