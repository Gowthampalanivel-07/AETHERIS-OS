import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Network, Cpu, ShieldAlert, Zap, Mic, Volume2 } from 'lucide-react'
import { useBrain } from '../core/BrainContext'
import MagneticButton from './MagneticButton'
import KineticText from './KineticText'

export default function CommandCenter() {
  const { telemetry, status, persona, agents, orchestrateAgent, triggerGlitch, pulseRate } = useBrain()
  const [overclock, setOverclock] = useState(false)

  const handleOverclock = () => {
    setOverclock(!overclock)
    triggerGlitch()
    // Boost all agents if overclocking
    agents.forEach(a => orchestrateAgent(a.id, !overclock))
  }

  return (
    <div className={`command-center glass-panel ${overclock ? 'overclock-glow' : ''}`}>
      <div className="command-header">
        <Network size={16} className={overclock ? "text-accent animate-pulse" : ""} /> 
        <KineticText text="APEX COMMAND CORE" delay={0.2} />
      </div>

      <div className="command-layout">
        
        {/* Core Systems Override */}
        <div className="systems-block">
          <div className="block-title">CORE SYSTEMS</div>
          <MagneticButton 
            className={`override-btn ${overclock ? 'active' : ''}`}
            onClick={handleOverclock}
            magneticPull={0.15}
          >
            <Cpu size={14} />
            <KineticText text="SYSTEM OVERCLOCK" />
            {overclock && <Zap size={12} className="ml-auto animate-pulse text-yellow-400" />}
          </MagneticButton>
        </div>

        {/* Agent Orchestration */}
        <div className="systems-block">
          <div className="block-title">SWARM ORCHESTRATION</div>
          <div className="agents-grid">
            {agents.map((agent) => (
              <div key={agent.id} className="agent-pod">
                <div className="agent-icon" style={{ borderColor: agent.color }}>
                  <div className="agent-dot" style={{ background: agent.color, opacity: agent.speed > 1 ? 1 : 0.4 }} />
                </div>
                <div className="agent-meta">
                  <span>{agent.name}</span>
                  <span className="agent-speed">{agent.speed.toFixed(1)}x CLK</span>
                </div>
                <MagneticButton 
                  className="boost-btn"
                  onClick={() => orchestrateAgent(agent.id, agent.speed <= 1)}
                  style={{ color: agent.speed > 1 ? agent.color : 'inherit' }}
                  magneticPull={0.2}
                >
                  <Zap size={12} />
                </MagneticButton>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Synhesizer */}
        <div className="systems-block mt-auto">
           <div className="block-title flex justify-between">
             <span>VOICE SYNTHESIZER</span>
             {status === 'Thinking' || status === 'Acting' ? <Volume2 size={12} className="text-accent animate-pulse" /> : <Mic size={12} />}
           </div>
           
           <div className="synth-visualizer">
             {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="synth-bar"
                  animate={{
                    height: (status === 'Thinking' || status === 'Listening') 
                              ? [5, Math.random() * 30 + 10, 5] 
                              : 2,
                    backgroundColor: overclock ? 'var(--accent-2)' : 'var(--accent)'
                  }}
                  transition={{
                    duration: 0.2 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
             ))}
           </div>
           {overclock && <div className="text-[0.6rem] text-accent mt-2 font-black tracking-widest animate-pulse">WARNING: THERMAL LIMITS DISABLED</div>}
        </div>
      </div>

      <style>{`
        .command-center {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          height: 100%;
          transition: box-shadow 0.3s ease;
        }

        .overclock-glow {
          box-shadow: 0 0 40px rgba(245, 158, 11, 0.15) inset;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .command-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-high);
          letter-spacing: 0.1em;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 0.8rem;
        }

        .command-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
        }

        .systems-block {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .block-title {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--text-low);
          letter-spacing: 0.15em;
        }

        .override-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-glass);
          border-radius: var(--r-md);
          color: var(--text-med);
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.05em;
        }

        .override-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        .override-btn.active {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.4);
          color: #fca5a5;
          text-shadow: 0 0 10px rgba(252, 165, 165, 0.5);
        }

        .agents-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .agent-pod {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.6rem 0.8rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--r-md);
          border: 1px solid transparent;
        }

        .agent-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px dashed;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agent-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .agent-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .agent-speed {
          font-size: 0.6rem;
          color: var(--text-low);
          font-weight: 900;
        }

        .boost-btn {
          background: transparent;
          border: none;
          color: var(--text-low);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .boost-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .synth-visualizer {
          height: 40px;
          background: rgba(0,0,0,0.2);
          border-radius: var(--r-md);
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 0 10px;
        }

        .synth-bar {
          flex: 1;
          background: var(--accent);
          border-radius: 2px;
          min-height: 2px;
        }
      `}</style>
    </div>
  )
}

