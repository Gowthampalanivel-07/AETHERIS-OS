import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Shield, Globe, Cpu, Target, TrendingUp
} from 'lucide-react'
import { useBrain } from '../core/BrainContext'
import KineticText from './KineticText'

export default function OmniDashboard({ isIdle }) {
  const { telemetry, goals, recentActivity, persona, status } = useBrain()

  return (
    <motion.div 
      className="omni-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <AnimatePresence>
        {!isIdle && (
          <>
            {/* ─── Top-Right Corner Status (Contextual) ─── */}
            <motion.div
              className="floating-panel glass-panel"
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 10, y: -10 }}
              transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
              style={{ position: 'absolute', top: '2rem', right: '2rem', padding: '1.5rem', width: '320px', pointerEvents: 'auto' }}
            >
              <motion.h1
                className="corner-title"
                style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}
                animate={{ color: status === 'Thinking' ? 'var(--accent-2)' : 'var(--text-high)' }}
              >
                <KineticText text="AETHERIS" /> <span style={{ color: 'var(--text-low)' }}>OS</span>
              </motion.h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-low)', marginBottom: '1rem' }}>
                <KineticText text="NEURAL CORE ACTIVE /" delay={0.5} /> {persona.toUpperCase()} MODE
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-low)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={12} className="text-accent" />
                  <span>SYSTEM SECURE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={12} style={{ color: 'var(--emerald)' }} />
                  <span>OMNI-SYNC ACTIVE</span>
                </div>
              </div>
            </motion.div>

            {/* ─── Bottom-Left: Activity Feed (Contextual) ─── */}
            <motion.div
              className="floating-panel glass-panel"
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 0.8, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -10, y: 10 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              style={{ position: 'absolute', bottom: '6rem', left: '2rem', width: '300px', padding: '1.5rem', pointerEvents: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-mid)', fontWeight: 'bold' }}>
                <Activity size={14} /> NEURAL ACTIVITY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <AnimatePresence mode="popLayout">
                  {recentActivity.slice(0,3).map((act) => (
                    <motion.div 
                      key={act.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem' }}
                      layout
                    >
                      <span style={{ color: 'Math.random() > 0.5 ? var(--accent) : var(--text-low)', fontSize: '0.65rem' }}>{act.time}</span>
                      <span style={{ color: 'var(--text-high)' }}>{act.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ─── Bottom-Right: System Resources (Contextual) ─── */}
            <motion.div
              className="floating-panel glass-panel"
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 0.8, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 10, y: 10 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
              style={{ position: 'absolute', bottom: '6rem', right: '2rem', width: '280px', padding: '1.5rem', pointerEvents: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-mid)', fontWeight: 'bold' }}>
                <Cpu size={14} /> COMPUTE KERNEL
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="var(--accent)" 
                      strokeWidth="6"
                      strokeDasharray="251"
                      initial={{ strokeDashoffset: 251 }}
                      animate={{ strokeDashoffset: 251 - (251 * telemetry.systemLoad / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {telemetry.systemLoad}%
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-low)' }}>LATENCY: {Math.floor(telemetry.systemLoad / 10) + 5}ms</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-low)' }}>MEMORY: {telemetry.focusLevel}%</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
