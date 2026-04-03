import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useBrain } from '../core/BrainContext'

export default function ResonanceHUD() {
  const { resonance, persona, status } = useBrain()

  const waveParams = useMemo(() => {
    switch (resonance) {
      case 'Beta':  return { count: 40, height: 40, speed: 0.05, color: '#6366f1' } // Sharp, fast
      case 'Alpha': return { count: 30, height: 25, speed: 0.03, color: '#8b5cf6' } // Fluid
      case 'Theta': return { count: 20, height: 15, speed: 0.02, color: '#10b981' } // Calm
      default:      return { count: 15, height: 10, speed: 0.01, color: '#94a3b8' } // Deep
    }
  }, [resonance])

  return (
    <div className="resonance-hud glass-panel">
      <div className="resonance-header">
        <span className="res-label">NEURAL RESONANCE</span>
        <span className="res-value" style={{ color: waveParams.color }}>{resonance} WAVE SYNC</span>
      </div>

      <div className="wave-container">
        {[...Array(waveParams.count)].map((_, i) => (
          <motion.div
            key={i}
            className="wave-bar"
            style={{ 
              background: waveParams.color,
              width: `${100 / waveParams.count}%` 
            }}
            animate={{ 
              height: [
                Math.random() * waveParams.height + 5, 
                Math.random() * waveParams.height + 15, 
                Math.random() * waveParams.height + 5
              ],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 0.8 + i * waveParams.speed, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="res-footer">
        <div className="freq-stats">
          <span>{status === 'Thinking' ? 'SIGNAL INTERFERENCE: LOW' : 'COHERENCE: 0.992'}</span>
          <span>SENSITIVITY: {persona === 'Creative' ? 'HIGH' : 'NOMINAL'}</span>
        </div>
      </div>

      <style>{`
        .resonance-hud {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: rgba(0,0,0,0.2);
        }

        .resonance-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .res-label { color: var(--text-low); }

        .wave-container {
          height: 60px;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 10px;
        }

        .wave-bar {
          border-radius: 1px;
          min-height: 2px;
        }

        .res-footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 8px;
        }

        .freq-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.5rem;
          font-weight: 700;
          color: var(--text-low);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}

