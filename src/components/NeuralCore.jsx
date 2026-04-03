import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useBrain } from '../core/BrainContext'

export default function NeuralCore({ size = 'medium' }) {
  const { status, persona } = useBrain()

  // Dynamic colors based on persona
  const color = useMemo(() => {
    switch (persona) {
      case 'FRIDAY': return '#f43f5e'
      case 'VISION': return '#a855f7'
      case 'ULTRON': return '#dc2626'
      case 'ASCENDED': return '#ffffff'
      case 'JARVIS':
      default:       return '#3b82f6' 
    }
  }, [persona])

  const dimensions = size === 'large' ? 300 : 140

  // ─── Breathing Core Animation Logic ───
  let breathDuration = 6; 
  let breathScale = [1, 1.08, 1];
  let breathOpacity = [0.6, 1, 0.6];
  let pulseGlow = `0 0 60px ${color}40`;

  switch (status) {
    case 'Listening':
      breathDuration = 3;
      breathScale = [1.05, 1.15, 1.05];
      pulseGlow = `0 0 100px ${color}80`;
      break;
    case 'Thinking':
      breathDuration = 1.5;
      breathScale = [1.02, 1.1, 1.02];
      pulseGlow = `0 0 80px ${color}90`;
      break;
    case 'Acting':
      breathDuration = 0.8;
      breathScale = [1, 1.2, 1];
      breathOpacity = [0.8, 1, 0.8];
      pulseGlow = `0 0 120px ${color}`;
      break;
    case 'Idle':
    default:
      breathDuration = 6;
      breathScale = [1, 1.08, 1];
      breathOpacity = [0.4, 0.8, 0.4];
      pulseGlow = `0 0 40px ${color}30`;
      break;
  }

  return (
    <div className={`neural-core-wrapper ${persona.toLowerCase()} size-${size}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimensions,
      height: dimensions,
      position: 'relative'
    }}>
      {/* Outer Atmosphere Glow */}
      <motion.div 
        animate={{
          scale: breathScale,
          opacity: breathOpacity,
          boxShadow: [
            `0 0 20px ${color}20`,
            pulseGlow,
            `0 0 20px ${color}20`
          ]
        }}
        transition={{
          duration: breathDuration,
          ease: "easeInOut",
          repeat: Infinity
        }}
        style={{
          position: 'absolute',
          inset: -40,
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      {/* The Breathing Centerpiece */}
      <motion.div 
        className="orb-main"
        style={{ 
          width: dimensions * 0.4, 
          height: dimensions * 0.4,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${color} 40%, #000000 100%)`,
          boxShadow: `inset 0 0 20px rgba(255,255,255,0.5)`,
          filter: `blur(2px)`
        }}
        animate={{
          scale: breathScale,
        }}
        transition={{ 
          duration: breathDuration, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  )
}
