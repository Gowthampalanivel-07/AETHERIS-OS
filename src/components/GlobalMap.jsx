import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useBrain } from '../core/BrainContext'

export default function GlobalMap() {
  const { status, pulseRate, resonance } = useBrain()

  // Major Global Neural Hubs
  const hubs = [
    { name: 'San Francisco', x: 150, y: 140, color: '#38bdf8' },
    { name: 'New York', x: 260, y: 135, color: '#6366f1' },
    { name: 'London', x: 480, y: 100, color: '#8b5cf6' },
    { name: 'Tokyo', x: 850, y: 150, color: '#10b981' },
    { name: 'Sydney', x: 880, y: 350, color: '#f59e0b' },
    { name: 'Berlin', x: 510, y: 110, color: '#ef4444' }
  ]

  // Dynamic tracers connecting hubs
  const tracers = [
    { from: 0, to: 1 }, // SF -> NY
    { from: 1, to: 2 }, // NY -> LON
    { from: 2, to: 5 }, // LON -> BER
    { from: 5, to: 3 }, // BER -> TYO
    { from: 3, to: 4 }  // TYO -> SYD
  ]

  return (
    <div className="global-map-container glass-panel">
      <div className="map-header">
        <Globe size={14} className="text-accent" />
        <h2>NEURAL GLOBAL TELEMETRY</h2>
        <span className="sync-status">SYNC: {resonance.toUpperCase()} WAVE</span>
      </div>

      <div className="map-view-wrapper">
        <motion.div 
          className="map-projection"
          animate={{ x: [0, -400, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <svg className="map-svg" viewBox="0 0 1000 450">
            {/* Tracer Arcs */}
            {tracers.map((t, i) => {
              const start = hubs[t.from]
              const end = hubs[t.to]
              const midX = (start.x + end.x) / 2
              const midY = Math.min(start.y, end.y) - 50
              const path = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
              
              return (
                <g key={i}>
                  <path 
                    d={path} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="1" 
                    fill="none" 
                  />
                  {status !== 'Idle' && (
                    <motion.path 
                      d={path} 
                      stroke={hubs[t.to].color} 
                      strokeWidth="1.5" 
                      fill="none" 
                      strokeDasharray="10 200"
                      animate={{ strokeDashoffset: [-210, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                  )}
                </g>
              )
            })}

            {/* Neural Hubs */}
            {hubs.map((hub, i) => (
              <g key={hub.name}>
                {/* Node Glow */}
                <motion.circle 
                  cx={hub.x} cy={hub.y} r="12" 
                  fill={hub.color} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                {/* Node Core */}
                <circle cx={hub.x} cy={hub.y} r="3" fill="#fff" />
                <motion.circle 
                  cx={hub.x} cy={hub.y} r="4" 
                  stroke={hub.color} strokeWidth="1" fill="none"
                  animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 60 / pulseRate, repeat: Infinity }}
                />
                {/* Label */}
                <text x={hub.x + 8} y={hub.y + 4} fill="#fff" fontSize="8" opacity="0.4" fontFamily="monospace">
                  {hub.name.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      <div className="map-footer">
        <div className="telemetry-bar">
          <div className="bar-segment current" style={{ width: '65%' }} />
          <div className="bar-segment buffer" style={{ width: '20%' }} />
        </div>
        <div className="footer-stats">
          <span>LATENCY: 12ms</span>
          <span>UP-STREAM: 980Mbps</span>
          <span>ACTIVE_NODES: {hubs.length}</span>
        </div>
      </div>

      <style>{`
        .global-map-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          background: rgba(0,0,0,0.4);
          overflow: hidden;
        }

        .map-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1rem;
        }

        .map-header h2 {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          margin: 0;
          color: var(--text-high);
        }

        .sync-status {
          margin-left: auto;
          font-size: 0.6rem;
          font-weight: 900;
          color: var(--accent);
          text-shadow: 0 0 10px var(--accent-glow);
        }

        .map-view-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 80%);
        }

        .map-projection {
          width: 200%;
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }

        .map-svg {
          width: 100%;
          height: auto;
          opacity: 0.8;
        }

        .map-footer {
          margin-top: 2rem;
          border-top: 1px solid var(--border-glass);
          padding-top: 1.5rem;
        }

        .telemetry-bar {
          height: 2px;
          background: rgba(255,255,255,0.05);
          display: flex;
          margin-bottom: 1rem;
        }

        .bar-segment.current { background: var(--accent); }
        .bar-segment.buffer { background: var(--accent-2); opacity: 0.4; }

        .footer-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--text-low);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}

