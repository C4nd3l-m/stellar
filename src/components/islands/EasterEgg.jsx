import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECRETS = [
  {
    id: 1,
    hint: 'Encontraste la primera estrella ✦',
    title: 'Video sorpresa',
    icon: '🎬',
    type: 'video',
    videoSrc: '/images/Gio.mp4',
  },
  {
    id: 2,
    hint: 'La segunda estrella brilla más fuerte ✦✦',
    title: 'Para cuando sepas que sos el amor de mi vida',
    icon: '💌',
    content: 'Si estás leyendo esto, ya lo sabés.\n\nNo te lo tengo que decir yo.\n\nPero igual te lo digo: sos el amor de mi vida.\n\nGracias por existir.',
    type: 'letter',
  },
  {
    id: 3,
    hint: 'La tercera estrella te manda al futuro ✦✦✦',
    title: 'Mensaje del futuro · 2035',
    icon: '🔮',
    content: 'Si estás leyendo esto desde el futuro, espero que todavía nos riamos de heladeras exhibicionistas.\n\nSeguimos acá.',
    type: 'future',
  },
];

function SecretModal({ active, onClose }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className={`secret-modal ${active.type === 'video' ? 'secret-modal-video' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="secret-modal-icon">{active.icon}</div>
        <p className="secret-modal-hint">{active.hint}</p>
        <h3 className="secret-modal-title">{active.title}</h3>
        <div className="divider" style={{ margin: '1.25rem auto' }} />

        {active.type === 'video' ? (
          <div className="video-wrapper">
            <video
              src={active.videoSrc}
              controls
              playsInline
              className="secret-video"
              poster=""
            >
              Tu navegador no soporta este video.
            </video>
            <p className="video-caption">🎬 Hecho con todo el amor del mundo ✨</p>
          </div>
        ) : (
          <p className="secret-modal-content">{active.content}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function EasterEgg() {
  const [unlocked, setUnlocked] = useState([]);
  const [active, setActive] = useState(null);

  const unlock = (id) => {
    if (!unlocked.includes(id)) setUnlocked(prev => [...prev, id]);
    setActive(SECRETS.find(s => s.id === id));
  };

  return (
    <section className="easter-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="easter-header">
        <span className="eyebrow">🔐 Secretos</span>
        <h2 className="easter-title">Estrellas ocultas</h2>
        <div className="divider" />
        <p className="easter-sub">Hay cosas que guardé solo para vos. Buscá las estrellas.</p>
      </motion.div>

      <div className="stars-field">
        {SECRETS.map((secret, i) => {
          const positions = [
            { top: '20%', left: '15%' },
            { top: '55%', left: '70%' },
            { top: '80%', left: '35%' },
          ];
          const pos = positions[i];
          const isUnlocked = unlocked.includes(secret.id);

          return (
            <motion.button
              key={secret.id}
              style={{ top: pos.top, left: pos.left }}
              className={`secret-star ${isUnlocked ? 'star-unlocked' : ''}`}
              onClick={() => unlock(secret.id)}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.8, opacity: 1 }}
              aria-label={`Secreto ${secret.id}`}
            >
              {isUnlocked ? '★' : '✦'}
            </motion.button>
          );
        })}

        <div className="stars-hint">
          <p>{unlocked.length} de {SECRETS.length} secretos encontrados</p>
          <div className="stars-progress">
            {SECRETS.map(s => (
              <div key={s.id} className={`star-pip ${unlocked.includes(s.id) ? 'pip-lit' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Unlocked list */}
      {unlocked.length > 0 && (
        <div className="unlocked-list">
          {SECRETS.filter(s => unlocked.includes(s.id)).map(secret => (
            <motion.div
              key={secret.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="unlocked-item"
              onClick={() => setActive(secret)}
            >
              <span>{secret.icon}</span>
              <span className="unlocked-title">{secret.title}</span>
              <span className="unlocked-arrow">→</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {active && <SecretModal active={active} onClose={() => setActive(null)} />}
      </AnimatePresence>

      <style>{`
        .easter-section { padding: 6rem 1.5rem; max-width: 800px; margin: 0 auto; }
        .easter-header { text-align: center; margin-bottom: 3rem; }
        .eyebrow { display: block; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-rose-warm); margin-bottom: 1rem; }
        .easter-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--color-cream); margin-bottom: 1rem; }
        .easter-sub { color: var(--color-muted); font-size: 0.95rem; }

        .stars-field { position: relative; height: 280px; background: rgba(17,13,30,0.5); border: 1px solid rgba(184,159,212,0.08); border-radius: 20px; margin-bottom: 2rem; overflow: hidden; }
        .secret-star { position: absolute; background: none; border: none; cursor: pointer; font-size: 1.8rem; color: var(--color-gold-soft); transform: translate(-50%, -50%); }
        .star-unlocked { color: var(--color-rose-warm); }

        .stars-hint { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); text-align: center; }
        .stars-hint p { font-size: 0.75rem; color: var(--color-muted); margin-bottom: 0.5rem; }
        .stars-progress { display: flex; gap: 0.5rem; justify-content: center; }
        .star-pip { width: 8px; height: 8px; border-radius: 50%; background: rgba(184,159,212,0.2); transition: all 0.3s; }
        .pip-lit { background: var(--color-rose-warm); box-shadow: 0 0 8px rgba(232,133,106,0.5); }

        .unlocked-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .unlocked-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: rgba(232,133,106,0.06); border: 1px solid rgba(232,133,106,0.14); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
        .unlocked-item:hover { background: rgba(232,133,106,0.1); }
        .unlocked-title { flex: 1; font-size: 0.9rem; color: var(--color-cream); font-family: var(--font-display); }
        .unlocked-arrow { color: var(--color-rose-warm); font-size: 0.9rem; }

        .secret-modal { background: rgba(17,13,30,0.97); border: 1px solid rgba(212,167,106,0.2); border-radius: 20px; max-width: 520px; width: 100%; padding: 3rem 2.5rem; position: relative; text-align: center; max-height: 90vh; overflow-y: auto; }
        .secret-modal-video { max-width: 720px; }
        .modal-close { position: absolute; top: 1.25rem; right: 1.25rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-muted); font-size: 0.8rem; transition: all 0.2s; }
        .modal-close:hover { background: rgba(255,255,255,0.14); color: var(--color-cream); }
        .secret-modal-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .secret-modal-hint { font-size: 0.75rem; letter-spacing: 0.1em; color: var(--color-gold-soft); text-transform: uppercase; margin-bottom: 0.75rem; }
        .secret-modal-title { font-family: var(--font-display); font-size: 1.4rem; color: var(--color-cream); margin-bottom: 0.5rem; }
        .secret-modal-content { font-size: 1rem; color: var(--color-cream-dim); line-height: 1.8; white-space: pre-line; text-align: left; margin-top: 0.5rem; }

        .video-wrapper { margin-top: 0.5rem; border-radius: 12px; overflow: hidden; background: #000; }
        .secret-video { width: 100%; max-height: 60vh; display: block; border-radius: 12px; }
        .video-caption { font-size: 0.8rem; color: var(--color-muted); margin-top: 0.85rem; letter-spacing: 0.05em; }

        @media (max-width: 600px) {
          .secret-modal { padding: 2rem 1.25rem; }
          .secret-modal-video { max-width: 100%; }
        }
      `}</style>
    </section>
  );
}
