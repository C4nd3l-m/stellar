import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const colorMap = {
  blue: { border: 'rgba(100,149,237,0.2)', glow: 'rgba(100,149,237,0.15)', accent: '#7ba7e8' },
  purple: { border: 'rgba(184,159,212,0.2)', glow: 'rgba(184,159,212,0.12)', accent: '#b89fd4' },
  gold: { border: 'rgba(212,167,106,0.2)', glow: 'rgba(212,167,106,0.12)', accent: '#d4a76a' },
  rose: { border: 'rgba(232,133,106,0.2)', glow: 'rgba(232,133,106,0.12)', accent: '#e8856a' },
};

function LetterModal({ letter, onClose }) {
  const colors = colorMap[letter.data.color] || colorMap.rose;
  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="letter-modal"
        style={{ borderColor: colors.border }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="modal-icon">{letter.data.icon}</div>
        <h2 className="modal-title" style={{ color: colors.accent }}>{letter.data.title}</h2>
        {letter.data.unlockMessage && <p className="modal-unlock">✦ {letter.data.unlockMessage} ✦</p>}
        <div className="divider" style={{ margin: '1.25rem auto' }} />
        <div className="modal-body prose-cosmos" dangerouslySetInnerHTML={{ __html: letter.html }} />
      </motion.div>
    </motion.div>
  );
}

export default function SecretVault({ letters = [] }) {
  const [open, setOpen] = useState(null);
  const sorted = [...letters].sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  return (
    <section className="vault-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="vault-header">
        <span className="eyebrow">💌 Bóveda</span>
        <h2 className="section-title">Cartas secretas</h2>
        <div className="divider" />
        <p className="vault-sub">Guárdalas. Abrilas cuando las necesites.</p>
      </motion.div>

      <div className="vault-grid">
        {sorted.map((letter) => {
          const colors = colorMap[letter.data.color] || colorMap.rose;
          return (
            <motion.div
              key={letter.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="letter-card"
              style={{ borderColor: colors.border, boxShadow: `0 0 40px ${colors.glow}` }}
              onClick={() => setOpen(letter)}
            >
              <div className="letter-icon">{letter.data.icon}</div>
              <h3 className="letter-title" style={{ color: colors.accent }}>{letter.data.title}</h3>
              <p className="letter-hint">Tocá para abrir →</p>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>{open && <LetterModal letter={open} onClose={() => setOpen(null)} />}</AnimatePresence>

      <style>{`
        .vault-section { padding: 6rem 1.5rem; max-width: 900px; margin: 0 auto; }
        .vault-header { text-align: center; margin-bottom: 3.5rem; }
        .eyebrow { display: block; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-rose-warm); margin-bottom: 1rem; }
        .section-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--color-cream); margin-bottom: 1rem; }
        .vault-sub { color: var(--color-muted); font-size: 0.95rem; }
        .vault-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
        .letter-card { background: rgba(28,22,51,0.65); border: 1px solid; backdrop-filter: blur(16px); border-radius: 16px; padding: 2.5rem 1.75rem; text-align: center; cursor: pointer; transition: transform 0.3s ease; }
        .letter-icon { font-size: 2rem; margin-bottom: 1rem; display: block; }
        .letter-title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; line-height: 1.35; }
        .letter-hint { font-size: 0.78rem; color: var(--color-muted); }
        .letter-modal { background: rgba(17,13,30,0.97); border: 1px solid; border-radius: 20px; max-width: 560px; width: 100%; padding: 3rem 2.5rem; position: relative; max-height: 85vh; overflow-y: auto; }
        .modal-close { position: absolute; top: 1.25rem; right: 1.25rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-muted); font-size: 0.8rem; transition: all 0.2s; }
        .modal-close:hover { background: rgba(255,255,255,0.12); color: var(--color-cream); }
        .modal-icon { font-size: 2.5rem; text-align: center; margin-bottom: 1rem; }
        .modal-title { font-family: var(--font-display); font-size: 1.4rem; text-align: center; margin-bottom: 0.75rem; }
        .modal-unlock { text-align: center; font-size: 0.78rem; letter-spacing: 0.1em; color: var(--color-muted); }
        .modal-body { margin-top: 1.5rem; }
      `}</style>
    </section>
  );
}
