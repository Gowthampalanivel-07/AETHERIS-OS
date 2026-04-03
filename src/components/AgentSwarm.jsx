import React from 'react'
import { motion } from 'framer-motion'
import { useBrain } from '../core/BrainContext'

export default function AgentSwarm({ size = 'medium' }) {
  const { agents, status } = useBrain()
  
  const baseRadius = size === 'large' ? 180 : 100

  return (
    <div className="agent-swarm-container">
      {agents.map((agent, i) => (
        <AgentOrb 
          key={agent.id} 
          agent={agent} 
          index={i} 
          radius={baseRadius + (i * 25)} 
        />
      ))}

      <style>{`
        .agent-swarm-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

function AgentOrb({ agent, index, radius }) {
  const isWorking = agent.status !== 'Idle'

  return (
    <motion.div
      className="agent-orbit-path"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 10 + index * 5, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      <motion.div 
        className="agent-orb"
        style={{ 
          background: agent.color,
          boxShadow: `0 0 15px ${agent.color}`,
          left: '50%',
          top: -6
        }}
        animate={{
          scale: isWorking ? [1, 1.4, 1] : 1,
          opacity: isWorking ? 1 : 0.4
        }}
        transition={{ duration: 1, repeat: isWorking ? Infinity : 0 }}
      >
        <div className="agent-label">{agent.name}</div>
        {isWorking && (
          <div className="agent-status-glow" style={{ background: agent.color }} />
        )}
      </motion.div>

      <style>{`
        .agent-orbit-path {
          position: absolute;
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 50%;
        }

        .agent-orb {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agent-label {
          position: absolute;
          top: -18px;
          font-size: 0.5rem;
          font-weight: 800;
          color: white;
          white-space: nowrap;
          letter-spacing: 0.1em;
          opacity: 0.8;
          text-shadow: 0 0 10px black;
        }

        .agent-status-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(4px);
        }
      `}</style>
    </motion.div>
  )
}

