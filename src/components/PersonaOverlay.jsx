import React, { useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBrain } from '../core/BrainContext'

export default function PersonaOverlay() {
  const { persona, status, glitchActive } = useBrain()
  const canvasRef = useRef(null)

  // â”€â”€â”€ Ultron: Fractal Decay (Canvas Effects) â”€â”€â”€
  useEffect(() => {
    if (persona !== 'ULTRON') return
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrame

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Random jagged glitches
      if (Math.random() > 0.8) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()
        const y = Math.random() * canvas.height
        ctx.moveTo(0, y)
        for (let x = 0; x < canvas.width; x += 100) {
          ctx.lineTo(x, y + (Math.random() - 0.5) * 40)
        }
        ctx.stroke()
      }

      // Small noise particles
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(239, 68, 68, ${Math.random() * 0.2})`
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
      }

      animationFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [persona])

  return (
    <div className="persona-overlay-container">
      {/* â”€â”€â”€ JARVIS: Holographic HUD Rings â”€â”€â”€ */}
      <AnimatePresence>
        {persona === 'JARVIS' && (
          <motion.div 
            className="hud-jarvis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg className="hud-svg" viewBox="0 0 1000 1000">
              {/* Outer Tactical Ring */}
              <motion.circle 
                cx="500" cy="500" r="450" 
                stroke="var(--accent)" strokeWidth="0.5" fill="none"
                strokeDasharray="20 10"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
              {/* Inner Scanning Ring */}
              <motion.circle 
                cx="500" cy="500" r="380" 
                stroke="var(--accent)" strokeWidth="1" fill="none"
                strokeDasharray="100 500"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              {/* Tactical Crosshairs */}
              <g stroke="var(--accent)" strokeWidth="0.5" opacity="0.3">
                <line x1="500" y1="0" x2="500" y2="1000" />
                <line x1="0" y1="500" x2="1000" y2="500" />
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€â”€ ULTRON: Fractal Canvas â”€â”€â”€ */}
      {persona === 'ULTRON' && <canvas ref={canvasRef} className="hud-ultron-canvas" />}

      {/* â”€â”€â”€ FRIDAY: Armor Diagnostics â”€â”€â”€ */}
      <AnimatePresence>
        {persona === 'FRIDAY' && (
          <motion.div 
            className="hud-friday"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="friday-side-bar left" />
            <div className="friday-side-bar right" />
            <div className="friday-corner top-left" />
            <div className="friday-corner top-right" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€â”€ VISION: Mind Stone Aura â”€â”€â”€ */}
      <AnimatePresence>
        {persona === 'VISION' && (
          <motion.div 
            className="hud-vision"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="vision-aura" />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .persona-overlay-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .hud-jarvis, .hud-vision {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-svg {
          width: 120%;
          height: 120%;
          opacity: 0.15;
          filter: blur(1px);
        }

        .hud-ultron-canvas {
          position: absolute;
          inset: 0;
          opacity: 0.6;
        }

        .hud-friday {
          position: absolute;
          inset: 0;
        }

        .friday-side-bar {
          position: absolute;
          top: 10%;
          bottom: 10%;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--accent), transparent);
          opacity: 0.3;
        }
        .friday-side-bar.left { left: 40px; }
        .friday-side-bar.right { right: 40px; }

        .friday-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 1px solid var(--accent);
          opacity: 0.2;
        }
        .friday-corner.top-left { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
        .friday-corner.top-right { top: 40px; right: 40px; border-left: 0; border-bottom: 0; }

        .vision-aura {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
          animation: vision-glow 10s ease-in-out infinite;
        }

        @keyframes vision-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

