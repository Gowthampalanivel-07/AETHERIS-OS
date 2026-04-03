import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useBrain } from '../core/BrainContext'

// ─── Particle trail emitted when Acting ───
function ParticleTrail({ x, y, color }) {
  const [particles, setParticles] = useState([])
  const lastPos = useRef({ x: 0, y: 0 })
  const frameRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const cx = x.get(), cy = y.get()
      const dx = Math.abs(cx - lastPos.current.x)
      const dy = Math.abs(cy - lastPos.current.y)
      if (dx + dy > 6) {
        lastPos.current = { x: cx, y: cy }
        const id = performance.now() + Math.random()
        setParticles(prev => [...prev.slice(-12), {
          id, x: cx, y: cy,
          vx: (Math.random() - 0.5) * 40,
          vy: (Math.random() - 0.5) * 40,
          size: Math.random() * 4 + 2
        }])
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [x, y])

  return (
    <AnimatePresence>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'fixed', left: p.x, top: p.y,
            x: '-50%', y: '-50%',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: color,
            pointerEvents: 'none',
            zIndex: 99996,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0, x: p.vx, y: p.vy }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  )
}

// ─── Main Cursor System ───
export default function CursorSystem() {
  const { persona, status } = useBrain()
  const [hoverInfo, setHoverInfo] = useState({ active: false, text: '', shape: 'circle' })
  const [clicking, setClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const rawX = useMotionValue(-300)
  const rawY = useMotionValue(-300)
  const springX = useSpring(rawX, { stiffness: 180, damping: 28, mass: 0.6 })
  const springY = useSpring(rawY, { stiffness: 180, damping: 28, mass: 0.6 })

  const PERSONA_COLORS = {
    JARVIS: '#38bdf8', FRIDAY: '#f59e0b',
    VISION: '#10b981', ULTRON: '#ef4444', ASCENDED: '#eab308'
  }
  const color = PERSONA_COLORS[persona] || '#6366f1'

  const checkHover = useCallback((e) => {
    const el = e.target.closest(
      'button, a, [role="button"], [data-cursor], ' +
      '.nav-item, .persona-pill, .override-btn, .boost-btn, ' +
      '.goal-card, .agent-pod, .bento-card, .mic-toggle, input'
    )
    if (el) {
      const cursorText = el.dataset?.cursor || ''
      const shape = el.dataset?.cursorShape || (el.tagName === 'INPUT' ? 'beam' : 'circle')
      setHoverInfo({ active: true, text: cursorText, shape })
    } else {
      setHoverInfo({ active: false, text: '', shape: 'circle' })
    }
  }, [])

  useEffect(() => {
    document.body.style.cursor = 'none'

    const onMove = (e) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', checkHover, { passive: true })
    window.addEventListener('mouseleave', () => setIsVisible(false))
    window.addEventListener('mouseenter', () => setIsVisible(true))

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', checkHover)
    }
  }, [rawX, rawY, checkHover, isVisible])

  if (!isVisible) return null

  const ringSize = clicking ? 18 : hoverInfo.active ? 48 : 30
  const borderRadius = hoverInfo.shape === 'square' ? '6px' : hoverInfo.shape === 'beam' ? '2px' : '50%'

  return (
    <>
      {/* Particle trail when Acting */}
      {status === 'Acting' && <ParticleTrail x={rawX} y={rawY} color={color} />}

      {/* Spring-lagged ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: springX, top: springY,
          x: '-50%', y: '-50%',
          pointerEvents: 'none',
          zIndex: 99998,
          border: `1.5px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        animate={{
          width: ringSize, height: ringSize,
          borderRadius,
          backgroundColor: hoverInfo.active ? `${color}15` : 'transparent',
          scale: clicking ? 0.75 : 1,
          opacity: hoverInfo.active ? 1 : 0.65,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <AnimatePresence>
          {hoverInfo.text && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              style={{
                fontSize: '0.38rem', fontWeight: 900,
                color, letterSpacing: '0.12em',
                whiteSpace: 'nowrap', userSelect: 'none',
                fontFamily: 'Space Grotesk, monospace'
              }}
            >
              {hoverInfo.text}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Precise dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: rawX, top: rawY,
          x: '-50%', y: '-50%',
          pointerEvents: 'none',
          zIndex: 99999,
          width: 5, height: 5,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px 2px ${color}`,
        }}
        animate={{
          scale: clicking ? 3 : hoverInfo.active ? 0 : 1,
          opacity: hoverInfo.active ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Click ripple burst */}
      <AnimatePresence>
        {clicking && (
          <motion.div
            key={Date.now()}
            style={{
              position: 'fixed',
              left: rawX, top: rawY,
              x: '-50%', y: '-50%',
              pointerEvents: 'none', zIndex: 99997,
              border: `2px solid ${color}`,
              borderRadius: '50%',
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 60, height: 60, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
