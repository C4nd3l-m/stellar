import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoveReasons({ reasons = [] }) {
  const [current, setCurrent] = useState(null);
  const [shown, setShown] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const countRef = useRef(0);

  function getNext() {
    const remaining = reasons.filter((_, i) => !shown.includes(i));
    if (remaining.length === 0) {
      setIsDone(true);
      return;
    }
    const pool = reasons.map((_, i) => i).filter(i => !shown.includes(i));
    const idx = pool[Math.floor(Math.random() * pool.length)];
    const next = shown.concat(idx);
    setShown(next);
    setCurrent({ text: reasons[idx], index: idx, count: next.length });
    countRef.current = next.length;
  }

  function reset() {
    setCurrent(null);
    setShown([]);
    setIsDone(false);
    countRef.current = 0;
  }

  return (
    <section className="reasons-section">
      <div className="reasons-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="reasons-header"
        >
          <span className="eyebrow">❤️ Razones</span>
          <h2 className="section-title">Cosas que amo de vos</h2>
          <div className="divider" />
          <p className="section-sub">Cada click descubre una razón más.</p>
        </motion.div>

        <div className="reasons-card-wrap">
          <AnimatePresence mode="wait">
            {!current && !isDone && (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="reason-card reason-card--start"
              >
                <div className="reason-heart">♡</div>
                <p className="reason-prompt">¿Querés saber por qué te amo?</p>
                <p className="reason-sub">Hay {reasons.length} razones esperando.</p>
              </motion.div>
            )}

            {current && !isDone && (
              <motion.div
                key={current.index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="reason-card reason-card--active"
              >
                <div className="reason-number">#{current.count}</div>
                <div className="reason-heart">❤️</div>
                <p className="reason-text">"{current.text}"</p>
                <div className="reason-progress">
                  <div
                    className="reason-progress-bar"
                    style={{ width: `${(current.count / reasons.length) * 100}%` }}
                  />
                </div>
                <p className="reason-counter">{current.count} de {reasons.length}</p>
              </motion.div>
            )}

            {isDone && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="reason-card reason-card--done"
              >
                <div className="reason-heart">💫</div>
                <p className="reason-text">Y hay mil razones más que no caben en una pantalla.</p>
                <p className="reason-sub">Te amo en todas sus versiones.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="reasons-actions">
          {!isDone ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              onClick={getNext}
            >
              {!current ? 'Dame una razón ✨' : 'Dame una razón más ✨'}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              onClick={reset}
            >
              Volver a empezar 🔄
            </motion.button>
          )}
        </div>
      </div>

      <style>{`
        .reasons-section {
          padding: 6rem 1.5rem;
        }

        .reasons-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }

        .reasons-header { margin-bottom: 3rem; }

        .eyebrow {
          display: block;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-rose-warm);
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          color: var(--color-cream);
          margin-bottom: 1rem;
        }

        .section-sub {
          color: var(--color-muted);
          font-size: 0.95rem;
        }

        .reasons-card-wrap {
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
        }

        .reason-card {
          background: rgba(28, 22, 51, 0.7);
          border: 1px solid rgba(184, 159, 212, 0.12);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 480px;
        }

        .reason-card--start, .reason-card--done {
          border-color: rgba(232, 133, 106, 0.15);
        }

        .reason-heart {
          font-size: 2.5rem;
          margin-bottom: 1.2rem;
          display: block;
        }

        .reason-number {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: var(--color-rose-warm);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .reason-text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: var(--color-cream);
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .reason-prompt {
          font-family: var(--font-script);
          font-size: 1.4rem;
          color: var(--color-cream);
          margin-bottom: 0.5rem;
        }

        .reason-sub {
          font-size: 0.875rem;
          color: var(--color-muted);
          margin-top: 0.75rem;
        }

        .reason-progress {
          width: 100%;
          height: 2px;
          background: rgba(184, 159, 212, 0.15);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .reason-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-rose-warm), var(--color-gold-soft));
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .reason-counter {
          font-size: 0.75rem;
          color: var(--color-muted);
          letter-spacing: 0.05em;
        }

        .reasons-actions { display: flex; justify-content: center; }
      `}</style>
    </section>
  );
}
