import { motion } from 'framer-motion';

const DREAMS = [
  { icon: '🌊', text: 'Ver el mar juntos por primera vez (mi primera vez)', category: 'lugares' },
  { icon: '⛰️', text: 'Dormir bajo las estrellas', category: 'lugares' },
  { icon: '🤌', text: 'Perdernos en Italia', category: 'lugares' },
  { icon: '🗺️', text: 'Hacer un viaje en la ruta', category: 'locos' },
  { icon: '🌿', text: 'Construir un hogar lleno de plantas y frutas', category: 'construir' },
  { icon: '🍳', text: 'Cocinar juntos lo que cultivemos', category: 'construir' },
  { icon: '🏢', text: 'Crear una empresa con nuestro nombre', category: 'construir' },
  { icon: '🌹', text: 'Envejecer tomando limonada entre rosas', category: 'locos' },
  { icon: '😄', text: 'Reírnos de chistes malos a los 70', category: 'locos' },
];

const categoryColors = {
  lugares: { label: 'Lugares', bg: 'rgba(100,149,237,0.08)', border: 'rgba(100,149,237,0.18)', accent: '#7ba7e8' },
  construir: { label: 'Construir juntos', bg: 'rgba(212,167,106,0.08)', border: 'rgba(212,167,106,0.18)', accent: '#d4a76a' },
  locos: { label: 'Sueños locos', bg: 'rgba(184,159,212,0.08)', border: 'rgba(184,159,212,0.18)', accent: '#b89fd4' },
};

export default function FutureDreams() {
  const grouped = Object.entries(categoryColors).map(([cat, colors]) => ({
    cat, colors, items: DREAMS.filter(d => d.category === cat),
  }));

  return (
    <section className="dreams-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="dreams-header">
        <span className="eyebrow">✨ Futuro</span>
        <h2 className="dreams-title">Lo que viene</h2>
        <div className="divider" />
        <p className="dreams-sub">No solo miramos atrás. También miramos hacia allá.</p>
      </motion.div>

      <div className="dreams-groups">
        {grouped.map(({ cat, colors, items }) => (
          <div key={cat} className="dream-group">
            <h3 className="dream-group-title" style={{ color: colors.accent }}>{colors.label}</h3>
            <div className="dream-cards">
              {items.map((dream, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="dream-card"
                  style={{ background: colors.bg, borderColor: colors.border }}
                >
                  <span className="dream-icon">{dream.icon}</span>
                  <p className="dream-text">{dream.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .dreams-section { padding: 6rem 1.5rem; max-width: 960px; margin: 0 auto; }
        .dreams-header { text-align: center; margin-bottom: 3.5rem; }
        .eyebrow { display: block; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-rose-warm); margin-bottom: 1rem; }
        .dreams-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--color-cream); margin-bottom: 1rem; }
        .dreams-sub { color: var(--color-muted); font-size: 0.95rem; }
        .dreams-groups { display: flex; flex-direction: column; gap: 3rem; }
        .dream-group-title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1.25rem; }
        .dream-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .dream-card { border: 1px solid; border-radius: 14px; padding: 1.5rem 1.25rem; display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; cursor: default; }
        .dream-icon { font-size: 1.6rem; }
        .dream-text { font-size: 0.9rem; color: var(--color-cream-dim); line-height: 1.5; }
      `}</style>
    </section>
  );
}
