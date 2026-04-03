import React from 'react'
import { motion } from 'framer-motion'
import { History, Play, Pause, ChevronRight } from 'lucide-react'
import { useBrain } from '../core/BrainContext'

export default function ChronosSlider() {
  const { history, scrubHistory, isScrubbing } = useBrain()
  const [val, setVal] = React.useState(0)

  const handleChange = (e) => {
    const v = parseInt(e.target.value)
    setVal(v)
    scrubHistory(v)
  }

  if (history.length === 0) return null

  return (
    <div className="chronos-slider-container glass-panel">
      <div className="chronos-header">
        <div className="flex items-center gap-2">
          <History size={14} className={isScrubbing ? 'text-accent animate-spin-slow' : ''} />
          <span className="text-xs font-black tracking-widest">CHRONOS SYNC</span>
        </div>
        <div className="chronos-status">
          {isScrubbing ? (
            <span className="text-accent">SNAPSHOT {val} / {history.length}</span>
          ) : (
            <span className="text-low">LIVE REALTIME</span>
          )}
        </div>
      </div>

      <div className="slider-wrapper">
        <input 
          type="range" 
          min="0" 
          max={history.length} 
          value={val} 
          onChange={handleChange}
          className="chronos-range"
        />
        <div className="range-ticks">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="tick" />
           ))}
        </div>
      </div>

      <style>{`
        .chronos-slider-container {
          padding: 1.2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 1px solid var(--accent-low);
        }

        .chronos-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chronos-status {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .slider-wrapper {
          position: relative;
          padding: 10px 0;
        }

        .chronos-range {
          -webkit-appearance: none;
          width: 100%;
          background: rgba(255,255,255,0.05);
          height: 4px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .chronos-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: var(--accent);
          border: 3px solid var(--bg-primary);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent-glow);
          transition: transform 0.2s;
        }

        .chronos-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .range-ticks {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          padding: 0 4px;
        }

        .tick {
          width: 1px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          margin-top: 20px;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}

