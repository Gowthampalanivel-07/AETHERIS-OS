import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Search, Code, Cpu } from 'lucide-react'
import { useBrain } from '../core/BrainContext'
import KineticText from './KineticText'

export default function AgentNexus({ isIdle }) {
  const { status, persona, resonance, pulseRate, glitchActive, agents, taskAgent, triggerRipple } = useBrain()
  const [hoveredAgent, setHoveredAgent] = useState(null)
  const [packets, setPackets] = useState([])

  // Generate data packets moving between nodes
  useEffect(() => {
    let interval = null
    if (status !== 'Idle' && status !== 'Lockdown') {
      interval = setInterval(() => {
        setPackets(prev => {
          const randomAgent = agents[Math.floor(Math.random() * agents.length)]
          const newPacket = {
            id: Date.now() + Math.random(),
            agentName: randomAgent.name,
            color: randomAgent.color
          }
          return [...prev, newPacket].slice(-20)
        })
      }, 150)
    } else {
      setPackets([])
    }
    return () => clearInterval(interval)
  }, [status, agents])

  const radius = 220 

  return (
    <motion.div 
      className="agent-nexus-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: isIdle ? 0.3 : 1 }}
      transition={{ duration: 1 }}
      style={{ pointerEvents: isIdle ? 'none' : 'auto' }}
    >
      <div className="nexus-header">
        <div className="flex items-center gap-3">
          <Cpu className="text-accent animate-pulse" />
          <div className="flex flex-col">
            <h2 className="text-xl font-black italic tracking-tighter"><KineticText text="NEURAL SWARM NEXUS" /></h2>
            <span className="text-[10px] text-low tracking-widest uppercase">Autonomous Intelligence Layer</span>
          </div>
        </div>
        <div className="status-indicator">
          <span className="text-xs font-mono mr-2 opacity-50">ENGINE:</span>
          <span className="live-status">{status.toUpperCase()}</span>
        </div>
      </div>

      <div className="nexus-canvas">
        {/* Central Neural Hub */}
        <motion.div 
          className="central-core"
          animate={{
            boxShadow: status !== 'Idle' 
              ? [`0 0 20px var(--accent-glow)`, `0 0 60px var(--accent-glow)`, `0 0 20px var(--accent-glow)`]
              : `0 0 10px rgba(0,0,0,0.5)`,
            scale: status !== 'Idle' ? [1, 1.1, 1] : [1, 1.02, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="core-inner" />
          <div className="core-glow" />
          <span className="core-label">
            <div className="text-[8px] opacity-50 mb-1">COGNITIVE</div>
            <div className="font-black text-xs">AETHERIS</div>
          </span>
        </motion.div>

        {/* Dynamic Connections & Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {agents.map((agent, i) => {
            const rad = ((i * (360 / agents.length)) - 90) * (Math.PI / 180)
            const x = Math.cos(rad) * radius
            const y = Math.sin(rad) * radius
            const isActive = agent.status !== 'Idle' || status !== 'Idle'

            return (
              <React.Fragment key={agent.name}>
                <motion.line 
                  x1="50%" y1="50%" 
                  x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} 
                  stroke={agent.color} 
                  strokeWidth="1"
                  initial={{ opacity: 0.1 }}
                  animate={{ opacity: isActive ? 0.3 : 0.05 }}
                />
                
                {/* Packets for this agent */}
                {packets.filter(p => p.agentName === agent.name).map(p => (
                  <motion.circle
                    key={p.id}
                    r="2"
                    fill={p.color}
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 1.2, ease: "linear" }}
                    style={{
                      offsetPath: `path('M 0 0 L ${x} ${y}')`,
                      offsetRotate: '0deg',
                      position: 'absolute',
                      left: '50%',
                      top: '50%'
                    }}
                  />
                ))}
              </React.Fragment>
            )
          })}
        </svg>

        {/* Agents Nodes */}
        {agents.map((agent, i) => {
          const rad = ((i * (360 / agents.length)) - 90) * (Math.PI / 180)
          const x = Math.cos(rad) * radius
          const y = Math.sin(rad) * radius
          const isNodeActive = agent.status !== 'Idle' || Date.now() - agent.lastPing < 2000

          return (
            <div key={agent.name} className="absolute" style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}>
              <motion.div 
                className={`agent-node ${isNodeActive ? 'active' : ''}`}
                style={{ borderColor: agent.color }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  boxShadow: isNodeActive ? `0 0 20px ${agent.color}66` : 'none',
                  rotateZ: isNodeActive ? [0, 5, -5, 0] : 0
                }}
                onMouseEnter={() => setHoveredAgent(agent)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => {
                  taskAgent(agent.name, 'Optimizing Paths')
                  triggerRipple()
                }}
              >
                <div className="node-icon" style={{ background: agent.color }}>
                  {agent.name === 'Researcher' ? <Search size={16} /> : agent.name === 'Architect' ? <Brain size={16} /> : <Code size={16} />}
                </div>
                
                {/* Floating Meta HUD */}
                <AnimatePresence>
                  {hoveredAgent?.name === agent.name && (
                    <motion.div 
                      className="node-hud"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <div className="hud-title" style={{ color: agent.color }}>{agent.name}</div>
                      <div className="hud-row">
                        <span>LOAD:</span>
                        <span className="text-white">{(agent.speed * 45).toFixed(0)}%</span>
                      </div>
                      <div className="hud-row">
                        <span>STATUS:</span>
                        <span className="text-accent">{agent.status}</span>
                      </div>
                      <div className="hud-tap-hint">CLICK TO TASK</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Neural Ping Ripple */}
                <AnimatePresence>
                  {(isNodeActive || hoveredAgent?.name === agent.name) && (
                    <motion.div 
                      className="node-ripple"
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ border: `1px solid ${agent.color}` }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}
      </div>

      <style>{`
        .agent-nexus-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .nexus-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .live-status {
          font-weight: 900;
          color: var(--accent);
          text-shadow: 0 0 10px var(--accent-glow);
        }

        .nexus-canvas {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .central-core {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          backdrop-filter: blur(20px);
        }

        .core-inner {
          position: absolute;
          inset: 15px;
          border: 1px dashed var(--accent);
          opacity: 0.3;
          border-radius: 50%;
          animation: spin 20s linear infinite;
        }

        .core-label {
          text-align: center;
          color: var(--text-high);
          letter-spacing: 0.2rem;
        }

        .agent-node {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: border-color 0.3s;
          transform-style: preserve-3d;
        }

        .node-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .node-hud {
          position: absolute;
          bottom: 110%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.8rem;
          border-radius: 8px;
          font-family: monospace;
          min-width: 150px;
          z-index: 50;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }

        .hud-title {
          font-weight: 800;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .hud-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.2rem;
        }

        .hud-tap-hint {
          font-size: 0.5rem;
          color: var(--accent);
          text-align: center;
          margin-top: 0.5rem;
          opacity: 0.6;
        }

        .node-ripple {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          pointer-events: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}

