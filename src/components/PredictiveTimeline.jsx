import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, GitBranch, ArrowRight, Zap, AlertTriangle } from 'lucide-react'
import { useBrain } from '../core/BrainContext'

export default function PredictiveTimeline() {
  const { goals, status, glitchActive } = useBrain()

  // Generate predictive branches based on the top goal or default to system state
  const activeTarget = goals.length > 0 ? goals[0].title : 'System Latency Analysis'
  
  const branches = [
    { title: 'Optimal Path', probability: 82, color: 'var(--emerald)', icon: Zap, class: 'optimal' },
    { title: 'Standard Execution', probability: 15, color: 'var(--accent)', icon: ArrowRight, class: 'standard' },
    { title: 'Risk Vector', probability: 3, color: 'var(--accent-2)', icon: AlertTriangle, class: 'risk' }
  ]

  return (
    <div className={`probability-horizon glass-panel ${glitchActive ? 'glitch-border' : ''}`}>
      <div className="horizon-header">
        <GitBranch size={16} /> QUANTUM PROBABILITY HORIZON
      </div>

      <div className="horizon-body">
        
        {/* Core Origin Node */}
        <div className="origin-node">
          <div className="origin-pulse" />
          <div className="origin-label text-[0.6rem] tracking-widest font-black text-low mb-1 mt-6">CURRENT VECTOR</div>
          <div className="origin-target text-sm font-bold text-high truncate w-full text-center px-4">{activeTarget}</div>
        </div>

        {/* Branching Paths */}
        <div className="branch-container">
          {branches.map((branch, i) => (
            <motion.div 
              key={branch.title}
              className={`branch-path ${branch.class}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {/* Connecting Line */}
              <div className="branch-line">
                <motion.div 
                  className="line-tracer"
                  style={{ background: branch.color }}
                  animate={{ left: ['-100%', '100%'] }}
                  transition={{ duration: 2 - (i * 0.3), repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Node Data */}
              <div className="branch-node glass-panel">
                <div className="node-icon" style={{ color: branch.color }}>
                  <branch.icon size={12} />
                </div>
                <div className="node-info">
                  <span className="node-title">{branch.title}</span>
                  <span className="node-prob" style={{ color: branch.color }}>{branch.probability}% PROBABILITY</span>
                </div>
                {status === 'Thinking' && i === 0 && (
                  <motion.div 
                    className="calculating-ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .probability-horizon {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .glitch-border {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.2) inset;
        }

        .horizon-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-high);
          letter-spacing: 0.1em;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 0.8rem;
          z-index: 2;
        }

        .horizon-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .origin-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px dashed var(--border-glass);
        }

        .origin-pulse {
          position: absolute;
          top: -10px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--text-high);
          box-shadow: 0 0 15px white;
        }

        .origin-pulse::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .branch-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
          justify-content: space-around;
        }

        .branch-path {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .branch-line {
          position: absolute;
          left: 10px;
          bottom: 50%;
          width: 20px;
          height: 50px;
          border-left: 2px solid rgba(255,255,255,0.05);
          border-bottom: 2px solid rgba(255,255,255,0.05);
          border-bottom-left-radius: 8px;
          transform: translateY(50%);
          z-index: 0;
          overflow: hidden;
        }

        .line-tracer {
          position: absolute;
          bottom: -2px;
          width: 10px;
          height: 2px;
          box-shadow: 0 0 10px currentColor;
        }

        .branch-node {
          flex: 1;
          margin-left: 32px;
          padding: 0.8rem;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: var(--r-md);
          position: relative;
          z-index: 1;
          transition: transform 0.3s;
        }

        .branch-node:hover {
          transform: translateX(5px);
          background: rgba(255,255,255,0.05);
        }

        .node-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .node-info {
          display: flex;
          flex-direction: column;
        }

        .node-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-high);
        }

        .node-prob {
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .calculating-ring {
          position: absolute;
          right: 12px;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: var(--accent);
          border-right-color: var(--accent);
          border-radius: 50%;
        }

        .optimal .branch-node { border-left: 3px solid var(--emerald); }
        .standard .branch-node { border-left: 3px solid var(--accent); }
        .risk .branch-node { border-left: 3px solid var(--accent-2); opacity: 0.7; }
      `}</style>
    </div>
  )
}

