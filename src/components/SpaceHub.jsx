import React, { useEffect, useState, useRef } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Brain, Target, Database, Activity, 
  Layers, Search, Settings, Command, Globe,
  Mic, MicOff
} from 'lucide-react'
import { useBrain } from '../core/BrainContext'
import NeuralCore from './NeuralCore'
import ThoughtStream from './ThoughtStream'
import MemoryGraph from './MemoryGraph'
import PredictiveTimeline from './PredictiveTimeline'
import CommandCenter from './CommandCenter'
import OmniDashboard from './OmniDashboard'
import TelemetryTerminal from './TelemetryTerminal'
import LockdownHUD from './LockdownHUD'
import AgentNexus from './AgentNexus'
import ResonanceHUD from './ResonanceHUD'
import { playHoverBeep, playKeystroke } from '../core/SoundEngine'
import { respondTo } from '../core/VoiceEngine'
import MagneticButton from './MagneticButton'
import KineticText from './KineticText'


export default function SpaceHub() {
  const { status, persona, setPersona, goals, telemetry, think, listen, handleGoalDrop, glitchActive, resonance, pulseRate } = useBrain()
  const [activeTab, setActiveTab] = useState('Omni')
  const coreRef = useRef(null)

  // ─── Attention-Aware Idle Hook ───
  const [isIdle, setIsIdle] = useState(false)
  useEffect(() => {
    let timeoutId
    const resetIdle = () => {
      setIsIdle(false)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setIsIdle(true), 4000)
    }

    window.addEventListener('mousemove', resetIdle)
    window.addEventListener('keydown', resetIdle)
    window.addEventListener('click', resetIdle)
    window.addEventListener('scroll', resetIdle)
    
    resetIdle()
    return () => {
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      window.removeEventListener('click', resetIdle)
      window.removeEventListener('scroll', resetIdle)
      clearTimeout(timeoutId)
    }
  }, [])

  // ─── Holographic Parallax Hook ───
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = (clientX / innerWidth - 0.5) * 10 // Softened tilt
    const y = (clientY / innerHeight - 0.5) * -10 // Softened tilt
    setCoords({ x, y })
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleDragEnd = (event, info, goal) => {
    const coreElement = coreRef.current
    if (!coreElement) return

    const rect = coreElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distance = Math.sqrt(
      Math.pow(info.point.x - centerX, 2) + 
      Math.pow(info.point.y - centerY, 2)
    )

    if (distance < 150) { 
      handleGoalDrop(goal)
    }
  }

  // â”€â”€â”€ Remove Spline Watermark Logo â”€â”€â”€
  useEffect(() => {
    const removeSplineLogo = () => {
      // Spline injects an <a> tag after canvas load
      const logos = document.querySelectorAll(
        'a[href*="spline.design"], #logo, [class*="logo"]'
      )
      logos.forEach(el => el.remove())
    }
    // Poll for 5 seconds after mount to catch delayed injection
    const ids = [500, 1000, 1500, 2000, 3000, 5000].map(ms =>
      setTimeout(removeSplineLogo, ms)
    )
    return () => ids.forEach(clearTimeout)
  }, [])

  return (
    <div className={`os-container theme-${persona.toLowerCase()} ${glitchActive ? 'os-glitch' : ''}`}>
      <div className="aetheris-background">
        {/* Spline 3D Scene */}
        <div className="spline-bg">
          <Spline scene="https://prod.spline.design/PUMEbYmC7GTqZ7lW/scene.splinecode" />
        </div>
      </div>

      {/* Protocol Zero Lockdown Overlay */}
      <AnimatePresence>
        {status === 'Lockdown' && <LockdownHUD />}
      </AnimatePresence>

      {/* ─── Sidebar: OS Navigation ─── */}
      <motion.aside 
        className="glass-panel sidebar"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: isIdle ? 0.3 : 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
      >
        <div className="os-logo" style={{ opacity: isIdle ? 0.5 : 1, transition: 'opacity 1s ease-in-out' }}>
          <motion.div 
            className="logo-spark" 
            animate={{ 
              boxShadow: [`0 0 15px var(--accent)`, `0 0 30px var(--accent)`, `0 0 15px var(--accent)`],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <KineticText text="AETHERIS" className="font-bold tracking-widest text-white" />
        </div>

        <nav className="os-nav">
          {[
            { icon: Globe, label: 'Omni' },
            { icon: Brain, label: 'Brain' },
            { icon: Target, label: 'Goals' },
            { icon: Database, label: 'Memory' },
            { icon: Activity, label: 'Telemetry' },
            { icon: Settings, label: 'Settings' }
          ].map((item, i) => (
            <MagneticButton 
              key={i}
              className={`nav-item ${activeTab === item.label ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.label); respondTo.nav(item.label) }}
              onMouseEnter={playHoverBeep}
              magneticPull={0.1}
            >
              <item.icon size={20} />
              <span style={{ position: 'relative', zIndex: 1, flex: 1, textAlign: 'left' }}>{item.label}</span>
              {activeTab === item.label && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="nav-active-bg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </MagneticButton>
          ))}
        </nav>

        {/* Bottom Tools */}
        <div className="sidebar-bottom" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Resonance Monitor */}
          <div className="sidebar-resonance" style={{ padding: '0 10px' }}>
            <ResonanceHUD />
          </div>

          {/* Personality Engine Pill */}
          <div className="personality-engine">
            <div className="persona-label">ACTIVE PERSONA</div>
            <div className="persona-selector" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {['JARVIS', 'FRIDAY', 'VISION', 'ULTRON', 'ASCENDED'].map((p) => (
                <motion.button
                  key={p}
                  className={`persona-pill ${p.toLowerCase()} ${persona === p ? 'active' : ''}`}
                  onClick={() => { setPersona(p); respondTo.persona(p) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontSize: '0.6rem', padding: '4px' }}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ─── Main Workspace ─── */}
      <main className="workspace">
        <header className="command-bar glass-panel" style={{ opacity: isIdle ? 0.1 : 1, transition: 'opacity 1.5s ease-in-out', pointerEvents: isIdle ? 'none' : 'auto' }}>
          <div className="command-input-wrapper">
            <Search size={18} className={status === 'Thinking' ? 'text-accent animate-pulse' : 'text-low'} />
            <input 
              type="text" 
              placeholder={status === 'Thinking' ? 'NeuralCore is synthesizing...' : (status === 'Listening' ? 'Acoustic Uplink Active. Speak now...' : "Search goals, memories, or execute command...")}
              disabled={status === 'Thinking'}
              onKeyDown={(e) => {
                playKeystroke()
                if (e.key === 'Enter') {
                  think(e.target.value)
                  e.target.value = ''
                }
              }}
            />
            
            {/* Mic Toggle for Neural Acoustic Uplink */}
            <motion.button
              onClick={listen}
              className={`mic-toggle ${status === 'Listening' ? 'active text-red-500' : 'text-low'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {status === 'Listening' ? (
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <MicOff size={18} />
                </motion.div>
              ) : (
                <Mic size={18} />
              )}
            </motion.button>

            {status === 'Thinking' && (
              <motion.div 
                className="thinking-loader"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap size={14} className="text-accent" />
              </motion.div>
            )}
          </div>
          <div className="shortcut-hint">
            <Command size={14} /> K
          </div>
        </header>

        <motion.div 
          className="parallax-deck"
          animate={{ 
            rotateY: coords.x, 
            rotateX: coords.y 
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30, mass: 0.1 }}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'Omni' ? (
              <OmniDashboard key="omni" isIdle={isIdle} />
            ) : activeTab === 'Brain' ? (
              <AgentNexus key="agent-nexus" isIdle={isIdle} />
            ) : activeTab === 'Telemetry' ? (
              <TelemetryTerminal key="telemetry" isIdle={isIdle} />
            ) : activeTab === 'Memory' ? (
              <motion.div 
                key="memory"
                className="fullscreen-module glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                style={{ width: '80%', height: '70vh', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MemoryGraph />
              </motion.div>
            ) : activeTab === 'Goals' ? (
              <motion.div 
                key="goals"
                className="fullscreen-module"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ width: '100%', maxWidth: '800px', margin: 'auto', padding: '2rem' }}
              >
                <h2 style={{ color: 'var(--text-high)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={24} className="text-accent" /> ACTIVE GOALS ENGINE
                </h2>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {goals.map(goal => (
                    <motion.div 
                      key={goal.id} 
                      className="glass-panel"
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.5}
                      dragSnapToOrigin
                      onDragEnd={(e, info) => handleDragEnd(e, info, goal)}
                      whileDrag={{ scale: 1.05, zIndex: 100, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
                      style={{ padding: '1.5rem', cursor: 'grab' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{goal.title}</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{goal.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          style={{ height: '100%', background: 'var(--accent)', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-low)' }}>
                        DRAG TOWARDS NEURAL CORE TO EXECUTE SYNERGY
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'Settings' ? (
              <motion.div 
                key="settings"
                className="fullscreen-module glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                style={{ width: '80%', maxWidth: '600px', height: '60vh', margin: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}
              >
                <CommandCenter />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Telemetry Dock */}
        <footer className="telemetry-dock glass-panel" style={{ opacity: isIdle ? 0 : 1, transition: 'opacity 1.5s ease-in-out', pointerEvents: isIdle ? 'none' : 'auto' }}>
          <div className="telem-group">
            <Zap size={14} className="text-accent" />
            <span className="telem-label">BRAIN LOAD</span>
            <span className="telem-value">{telemetry.systemLoad}%</span>
          </div>
          <div className="telem-group">
            <Layers size={14} />
            <span className="telem-label">FOCUS LEVEL</span>
            <span className="telem-value">{telemetry.focusLevel}%</span>
          </div>
          <div className="telem-group">
            <Activity size={14} />
            <span className="telem-label">ENERGY</span>
            <span className="telem-value">{telemetry.energyLevel}%</span>
          </div>
        </footer>
      </main>

      <style>{`
        .os-container {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background: transparent;
        }

        .os-glitch {
          animation: glitch-jitter 0.2s infinite;
        }

        @keyframes glitch-jitter {
          0% { transform: translate(0); filter: hue-rotate(0deg) brightness(1); }
          25% { transform: translate(-2px, 1px); filter: hue-rotate(90deg) brightness(1.2); }
          50% { transform: translate(2px, -1px); filter: hue-rotate(180deg) brightness(1.4); }
          75% { transform: translate(-1px, 2px); filter: hue-rotate(270deg) brightness(1.2); }
          100% { transform: translate(0); filter: hue-rotate(360deg) brightness(1); }
        }

        .parallax-deck {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .sidebar {
          width: 280px;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          gap: 3rem;
        }

        .os-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 0.2em;
          color: var(--text-high);
          margin-bottom: 2.5rem;
        }

        .logo-spark {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent);
        }

        .os-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-med);
          border-radius: var(--r-md);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s var(--t-base);
          position: relative;
        }
        .nav-item.active {
          color: var(--text-high);
        }

        .nav-active-bg {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
          border-radius: var(--r-md);
          box-shadow: inset 4px 0 0 var(--accent);
          z-index: 0;
        }

        .nav-item:hover {
          color: var(--text-high);
        }

        .personality-engine {
          background: rgba(255,255,255,0.02);
          padding: 1rem;
          border-radius: var(--r-md);
          border: 1px solid var(--border-glass);
        }

        .persona-label {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--text-low);
          margin-bottom: 8px;
          letter-spacing: 0.1em;
        }

        .persona-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .persona-pill {
          padding: 0.4rem 0.8rem;
          border-radius: var(--r-full);
          font-size: 0.7rem;
          font-weight: 700;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.03);
          color: var(--text-med);
          cursor: pointer;
          transition: all 0.3s;
        }

        .persona-pill.active {
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 0 15px rgba(255,255,255,0.05);
        }

        .persona-pill.focus.active { background: var(--accent); color: white; }
        .persona-pill.creative.active { background: var(--accent-2); color: white; }
        .persona-pill.mentor.active { background: var(--emerald); color: white; }

        .command-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .thinking-loader {
          position: absolute;
          right: 12px;
        }

        .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .command-bar {
          height: 72px;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          gap: 1.5rem;
        }

        .command-bar input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-high);
          font-size: 1rem;
          font-family: inherit;
        }

        .shortcut-hint {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.05);
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          color: var(--text-low);
        }

        .intelligence-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          min-height: 0;
        }

        .neural-focus {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .status-pill {
          margin-top: 1rem;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .modular-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
          max-height: calc(100vh - 160px);
          padding-right: 12px;
        }

        .modular-column::-webkit-scrollbar {
          width: 2px;
        }

        .module {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-height: fit-content;
        }

        .module-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-high);
          letter-spacing: 0.1em;
        }

        .goals-list, .memory-grid {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .goal-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .goal-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .goal-title { color: var(--text-high); font-weight: 500; }
        .goal-perc { color: var(--text-med); font-size: 0.75rem; }

        .goal-bar {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .goal-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
        }

        .memory-node {
          padding: 0.8rem;
          background: rgba(255,255,255,0.03);
          border-radius: var(--r-md);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .node-dot {
          width: 6px; height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent);
        }

        .telemetry-dock {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
        }

        .telem-group {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .telem-label { color: var(--text-low); }
        .telem-value { color: var(--text-high); }
      `}</style>
    </div>
  )
}

