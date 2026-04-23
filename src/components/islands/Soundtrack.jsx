import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SONGS = [
  {
    title: 'I Love You For Infinity',
    artist: 'James Young',
    reason: 'La canción principal de nuestra historia.',
    special: true,
    youtubeId: 'FXdiTWLVIZo',
    note: '♾️ Esta es la nuestra.',
  },
  {
    title: 'Are You Mine?',
    artist: 'Arctic Monkeys',
    reason: 'Sonaba en esos momentos que no olvidamos.',
    youtubeId: 'oIWBVRCLtwU',
    note: '🎸 Siempre vuelvo a esta.',
  },
  {
    title: 'Just Pretend',
    artist: 'Bad Omens',
    reason: 'Los momentos intensos que compartimos.',
    youtubeId: 'lgPd0fgIhoU',
    note: '🖤 Intensidad pura.',
  },
  {
    title: 'Balada para un loco',
    artist: 'Piazzolla & Ferrer',
    reason: 'Un tango que siente como nosotros: pasión y movimiento.',
    youtubeId: 'IrG5ernfF88',
    note: '🌹 Pasión Argentina.',
  },
];

function YoutubeModal({ song, onClose }) {
  return (
    <motion.div
      className="yt-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="yt-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="yt-header">
          <div className="yt-song-info">
            <p className="yt-title">{song.title} {song.special && <span className="yt-star">★</span>}</p>
            <p className="yt-artist">{song.artist}</p>
          </div>
          <button className="yt-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Video embed */}
        <div className="yt-embed-wrap">
          <iframe
            className="yt-iframe"
            src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${song.title} - ${song.artist}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Note */}
        <div className="yt-note">
          <p className="yt-note-text">{song.note}</p>
          <p className="yt-reason">{song.reason}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Soundtrack() {
  const [activeModal, setActiveModal] = useState(null);
  const [activeSong, setActiveSong] = useState(null);

  function openSong(song) {
    setActiveSong(song);
    setActiveModal(song);
  }

  function closeSong() {
    setActiveModal(null);
    // Keep activeSong for the "active" row style a moment
    setTimeout(() => setActiveSong(null), 300);
  }

  return (
    <section className="soundtrack-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="st-header"
      >
        <span className="eyebrow">🎵 Música</span>
        <h2 className="st-title">Nuestro soundtrack</h2>
        <div className="divider" />
        <p className="st-sub">Las canciones que sonaron mientras construíamos esto.</p>
        <p className="st-hint">Tocá una canción para escucharla ▷</p>
      </motion.div>

      {/* Cassette visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="cassette"
      >
        <div className="cassette-body">
          <div className="cassette-stripe" />
          <div className="cassette-top">
            <div
              className="cassette-spool"
              style={{ animation: activeSong ? 'spin 2.5s linear infinite' : 'none' }}
            />
            <div className="cassette-window">
              <span className="cassette-label">
                {activeSong ? `${activeSong.title} — ${activeSong.artist}` : 'Nuestro Soundtrack'}
              </span>
            </div>
            <div
              className="cassette-spool"
              style={{ animation: activeSong ? 'spin 2.5s linear infinite reverse' : 'none' }}
            />
          </div>
          <div className="cassette-bottom">
            <div className="cassette-hole" />
            <div className="cassette-tape-area">
              {activeSong && (
                <motion.div
                  className="cassette-eq"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="eq-bar"
                      style={{
                        animationDuration: `${0.5 + i * 0.12}s`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
            <div className="cassette-hole" />
          </div>
        </div>
      </motion.div>

      {/* Song list */}
      <div className="song-list">
        {SONGS.map((song, i) => {
          const isActive = activeSong?.youtubeId === song.youtubeId;
          return (
            <motion.div
              key={song.youtubeId}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ x: 4 }}
              className={`song-row ${song.special ? 'song-special' : ''} ${isActive ? 'song-active' : ''}`}
              onClick={() => openSong(song)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && openSong(song)}
            >
              <div className="song-num">{String(i + 1).padStart(2, '0')}</div>

              <div className="song-icon">
                {isActive ? (
                  <motion.div className="song-bars">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="song-bar-mini" style={{ animationDelay: `${j * 0.15}s` }} />
                    ))}
                  </motion.div>
                ) : (
                  <span className="song-play-btn">▷</span>
                )}
              </div>

              <div className="song-info">
                <p className="song-title">
                  {song.title}
                  {song.special && <span className="song-star"> ★</span>}
                </p>
                <p className="song-artist">{song.artist}</p>
              </div>

              <div className="song-reason-col">
                <p className="song-reason-text">{song.reason}</p>
              </div>

              <div className="song-yt-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
                <span>Ver</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* YouTube Modal */}
      <AnimatePresence>
        {activeModal && <YoutubeModal song={activeModal} onClose={closeSong} />}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes eq-mini { 0%, 100% { height: 3px; } 50% { height: 10px; } }

        .soundtrack-section { padding: 6rem 1.5rem; max-width: 760px; margin: 0 auto; }
        .st-header { text-align: center; margin-bottom: 2.5rem; }
        .eyebrow { display: block; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-rose-warm); margin-bottom: 1rem; }
        .st-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--color-cream); margin-bottom: 1rem; }
        .st-sub { color: var(--color-muted); font-size: 0.95rem; }
        .st-hint { color: var(--color-rose-warm); font-size: 0.8rem; margin-top: 0.5rem; letter-spacing: 0.05em; }

        /* Cassette */
        .cassette { display: flex; justify-content: center; margin-bottom: 2.5rem; }
        .cassette-body {
          background: linear-gradient(135deg, #1e1535, #140f25);
          border: 1.5px solid rgba(184,159,212,0.18);
          border-radius: 14px;
          padding: 1rem 1.5rem 1.25rem;
          width: 340px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .cassette-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--color-rose-warm), var(--color-gold-soft), var(--color-lilac));
        }
        .cassette-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .cassette-spool {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          border: 3px solid rgba(184,159,212,0.25);
          background: radial-gradient(circle, rgba(42,31,69,1) 35%, rgba(28,22,51,1) 100%);
          position: relative;
        }
        .cassette-spool::after {
          content: ''; position: absolute; inset: 8px; border-radius: 50%;
          border: 2px solid rgba(232,133,106,0.35);
        }
        .cassette-spool::before {
          content: ''; position: absolute; inset: 16px; border-radius: 50%;
          background: rgba(232,133,106,0.15);
        }
        .cassette-window { flex: 1; background: rgba(8,6,15,0.85); border-radius: 8px; padding: 0.5rem 0.75rem; text-align: center; border: 1px solid rgba(184,159,212,0.08); }
        .cassette-label { font-family: var(--font-script); font-size: 0.78rem; color: var(--color-cream-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .cassette-bottom { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .cassette-hole { width: 14px; height: 14px; border-radius: 50%; background: rgba(8,6,15,0.9); border: 1px solid rgba(184,159,212,0.1); }
        .cassette-tape-area { flex: 1; height: 20px; display: flex; align-items: center; justify-content: center; }
        .cassette-eq { display: flex; align-items: flex-end; gap: 3px; height: 20px; }
        .eq-bar { width: 3px; height: 4px; background: var(--color-rose-warm); border-radius: 2px; animation: eq 0.6s ease-in-out infinite alternate; }

        /* Song list */
        .song-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .song-row {
          display: grid;
          grid-template-columns: 28px 32px 1fr auto auto;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          background: rgba(28,22,51,0.4);
          border: 1px solid rgba(184,159,212,0.06);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .song-row:hover { background: rgba(28,22,51,0.75); border-color: rgba(232,133,106,0.18); transform: translateX(4px); }
        .song-active { background: rgba(232,133,106,0.07) !important; border-color: rgba(232,133,106,0.22) !important; }
        .song-special { border-color: rgba(212,167,106,0.12); }
        .song-num { font-size: 0.72rem; color: var(--color-muted); font-variant-numeric: tabular-nums; }
        .song-icon { width: 24px; display: flex; align-items: center; justify-content: center; }
        .song-play-btn { font-size: 0.85rem; color: var(--color-muted); transition: color 0.2s; }
        .song-row:hover .song-play-btn { color: var(--color-rose-warm); }
        .song-bars { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
        .song-bar-mini { width: 2.5px; height: 3px; background: var(--color-rose-warm); border-radius: 1px; animation: eq-mini 0.5s ease-in-out infinite alternate; }
        .song-info { min-width: 0; }
        .song-title { font-size: 0.92rem; color: var(--color-cream); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .song-star { color: var(--color-gold-soft); }
        .song-artist { font-size: 0.75rem; color: var(--color-muted); margin-top: 0.1rem; }
        .song-reason-col { display: none; }
        .song-yt-badge {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.7rem; color: rgba(255,100,100,0.6);
          border: 1px solid rgba(255,100,100,0.15);
          border-radius: 20px; padding: 0.2rem 0.6rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .song-row:hover .song-yt-badge { color: rgba(255,100,100,0.9); border-color: rgba(255,100,100,0.35); }

        @media (min-width: 600px) {
          .song-reason-col { display: block; }
          .song-reason-text { font-size: 0.75rem; color: var(--color-muted); font-style: italic; max-width: 180px; line-height: 1.35; }
        }

        /* YouTube Modal */
        .yt-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(8,6,15,0.88);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
        }
        .yt-modal {
          background: rgba(17,13,30,0.98);
          border: 1px solid rgba(232,133,106,0.18);
          border-radius: 20px;
          max-width: 680px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,133,106,0.06);
        }
        .yt-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(184,159,212,0.08);
        }
        .yt-title { font-family: var(--font-display); font-size: 1.05rem; color: var(--color-cream); font-weight: 600; }
        .yt-star { color: var(--color-gold-soft); }
        .yt-artist { font-size: 0.78rem; color: var(--color-muted); margin-top: 0.15rem; }
        .yt-close {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--color-muted); font-size: 0.75rem;
          transition: all 0.2s; flex-shrink: 0;
        }
        .yt-close:hover { background: rgba(255,255,255,0.12); color: var(--color-cream); }
        .yt-embed-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          background: #000;
        }
        .yt-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
        .yt-note {
          padding: 1rem 1.5rem 1.25rem;
          border-top: 1px solid rgba(184,159,212,0.07);
        }
        .yt-note-text { font-family: var(--font-script); font-size: 1rem; color: var(--color-rose-warm); margin-bottom: 0.25rem; }
        .yt-reason { font-size: 0.8rem; color: var(--color-muted); font-style: italic; }
      `}</style>
    </section>
  );
}
