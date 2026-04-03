import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Hash } from 'lucide-react'

export default function QuantumOutcome({ goal }) {
  const simulations = [
    { id: 1, label: 'Optimal Path', probability: 0.82, delay: 0.2 },
    { id: 2, label: 'Risk Vector', probability: 0.14, delay: 0.4 },
    { id: 3, label: 'Edge Case', probability: 0.04, delay: 0.6 },
  ]

  return (
    <div className="quantum-outcome-container">
      <div className="q-header">
        <Sparkles size={10} className="text-accent" />
        <span>SIMULATING OUTCOMES</span>
      </div>
      
      <div className="simulation-list">
        {simulations.map((sim) => (
          <motion.div 
            key={sim.id}
            className="sim-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sim.delay }}
          >
            <div className="sim-meta">
              <span className="sim-label">{sim.label}</span>
              <span className="sim-prob">{(sim.probability * 100).toFixed(0)}%</span>
            </div>
            <div className="sim-bar-bg">
              <motion.div 
                className="sim-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${sim.probability * 100}%` }}
                transition={{ duration: 1.5, delay: sim.delay }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .quantum-outcome-container {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          border-left: 2px solid var(--accent-low);
        }

        .q-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.6rem;
          font-weight: 900;
          color: var(--text-low);
          letter-spacing: 0.1em;
          margin-bottom: 0.8rem;
        }

        .simulation-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .sim-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sim-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 700;
        }

        .sim-label { color: var(--text-med); }
        .sim-prob { color: var(--accent); opacity: 0.8; }

        .sim-bar-bg {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          overflow: hidden;
        }

        .sim-bar-fill {
          height: 100%;
          background: var(--accent);
          opacity: 0.4;
        }
      `}</style>
    </div>
  )
}

