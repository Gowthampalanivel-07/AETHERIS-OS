import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, Wifi, Database, Server, ShieldCheck } from 'lucide-react'
import { useBrain } from '../core/BrainContext'
import GlobalMap from './GlobalMap'

export default function TelemetryTerminal() {
  const { telemetry, status, persona, resonance, pulseRate, glitchActive } = useBrain()
  const [networkPing, setNetworkPing] = useState([])
  const [hexDump, setHexDump] = useState([])

  // Simulate network pings
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkPing(prev => {
        const newPing = Math.random() * 40 + 10 + (telemetry.systemLoad / 5)
        return [...prev, newPing].slice(-30) // keep last 30
      })
    }, 400)
    return () => clearInterval(interval)
  }, [telemetry.systemLoad])

  // Simulate hex memory dump
  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== 'Idle') {
        const addr = '0x' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()
        const data = Array.from({length: 4}, () => Math.floor(Math.random()*255).toString(16).padStart(2, '0').toUpperCase()).join(' ')
        setHexDump(prev => [{ id: Date.now(), text: `${addr} : ${data}` }, ...prev].slice(0, 10))
      }
    }, 150)
    return () => clearInterval(interval)
  }, [status])

  return (
    <motion.div 
      className="telemetry-wrapper"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="telemetry-header">
        <h2><Activity size={24} className="text-accent" /> SYSTEM TELEMETRY</h2>
        <span className="live-badge animate-pulse">â— LIVE</span>
      </div>

      <div className="telemetry-grid">
        
        {/* 1. Core Diagnostics */}
        <div className="telemetry-card glass-panel">
          <div className="card-title"><Cpu size={16}/> CORE TEMPERATURE</div>
          <div className="metric-massive">
            {(30 + telemetry.systemLoad / 3).toFixed(1)}Â°C
          </div>
          <div className="metric-bar">
            <motion.div 
              className="metric-fill" 
              style={{ background: 'var(--accent)' }}
              animate={{ width: `${Math.min(100, telemetry.systemLoad)}%` }}
            />
          </div>
          <div className="metric-sub">Load: {telemetry.systemLoad.toFixed(2)}%</div>
        </div>

        {/* 2. Resonance Field */}
        <div className="telemetry-card glass-panel">
          <div className="card-title"><ShieldCheck size={16}/> RESONANCE FIELD</div>
          <div className="metric-massive">
            {resonance.toUpperCase()}
          </div>
          <div className="spectrum-visualizer">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i} 
                className="spectrum-bar"
                style={{ background: 'var(--accent)' }}
                animate={{ 
                  height: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.7
                }}
                transition={{ duration: 60 / pulseRate, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="metric-sub">Frequency: {pulseRate} Hz</div>
        </div>

        {/* 3. Global Network Hubs (NEW) */}
        <div className="telemetry-card glass-panel col-span-2">
          <GlobalMap />
        </div>

        {/* 4. Hex Dump Terminal */}
        <div className="telemetry-card glass-panel row-span-2">
          <div className="card-title"><Database size={16}/> L1 CACHE DUMP</div>
          <div className="hex-terminal font-mono">
            {hexDump.map(line => (
              <motion.div key={line.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                {line.text}
              </motion.div>
            ))}
            {status === 'Idle' && <div className="text-low mt-4">[ MEMORY STABLE ]</div>}
          </div>
        </div>

        {/* 5. Persona Protocol Override */}
        <div className="telemetry-card glass-panel">
          <div className="card-title"><Server size={16}/> ACTIVE PROTOCOL</div>
          <div className="metric-massive" style={{ fontSize: '1.8rem', color: 'var(--accent)' }}>
            {persona.toUpperCase()}
          </div>
          <div className="metric-sub text-low mt-2">
            Status: {status.toUpperCase()}
          </div>
          <div className="metric-sub text-low">
            Glitch Shielding: {glitchActive ? 'CRITICAL' : 'NOMINAL'}
          </div>
        </div>

      </div>

      <style>{`
        .telemetry-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem;
        }

        .telemetry-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1rem;
        }

        .telemetry-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-high);
          font-weight: 800;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .live-badge {
          color: #ef4444;
          font-weight: 800;
          letter-spacing: 0.1em;
          font-size: 0.8rem;
        }

        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, auto);
          gap: 1.5rem;
          flex: 1;
        }

        .telemetry-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-left: 2px solid var(--accent);
        }

        .col-span-2 { grid-column: span 2; }
        .row-span-2 { grid-row: span 2; }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--text-med);
          text-transform: uppercase;
        }

        .metric-massive {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-high);
          letter-spacing: 0.05em;
          text-shadow: 0 0 20px var(--accent-glow);
        }

        .metric-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .metric-fill {
          height: 100%;
        }

        .metric-sub {
          font-size: 0.8rem;
          color: var(--text-low);
          font-weight: bold;
        }

        .spectrum-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 50px;
          margin-top: auto;
        }

        .spectrum-bar {
          flex: 1;
          border-radius: 2px 2px 0 0;
        }

        .ping-chart {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 80px;
          background: rgba(0,0,0,0.2);
          padding: 10px;
          border-radius: var(--r-sm);
        }

        .ping-bar {
          flex: 1;
          border-radius: 2px 2px 0 0;
          min-width: 4px;
        }

        .hex-terminal {
          background: #000;
          flex: 1;
          padding: 1rem;
          border-radius: var(--r-sm);
          font-size: 0.8rem;
          color: var(--accent);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
        }
      `}</style>
    </motion.div>
  )
}

