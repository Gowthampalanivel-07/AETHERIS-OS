import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shell, Terminal, CheckCircle, Search, 
  Code, AlertCircle, Info, Activity, Lock
} from 'lucide-react'
import { useBrain } from '../core/BrainContext'

const DecryptedText = ({ text }) => {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let iteration = 0
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((letter, index) => {
        if (index < iteration) return letter
        if (letter === ' ') return ' '
        return chars[Math.floor(Math.random() * chars.length)]
      }).join(''))
      
      if (iteration >= text.length) clearInterval(interval)
      
      iteration += Math.max(text.length / 20, 1) // Decrypt speed
    }, 30)
    
    return () => clearInterval(interval)
  }, [text])

  return <span>{displayText}</span>
}

export default function ThoughtStream() {
  const { thoughtStream, glitchActive } = useBrain()
  const scrollRef = React.useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0 
    }
  }, [thoughtStream])

  const getIcon = (type) => {
    switch (type) {
      case 'reasoning':   return <Search size={12} />
      case 'plan':        return <Shell size={12} />
      case 'action':      return <Code size={12} />
      case 'result':      return <CheckCircle size={12} />
      case 'observation': return <Activity size={12} />
      default:            return <Info size={12} />
    }
  }

  return (
    <div className={`thought-stream-wrapper glass-panel ${glitchActive ? 'glitch-border' : ''}`}>
      <div className="stream-header">
        <Lock size={16} className="text-accent" /> SECURE NEURAL DECRYPTION PROTOCOL
      </div>
      
      <div className="stream-content" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {thoughtStream.map((thought) => {
            const hexId = '0x' + (thought.id % 16777215).toString(16).padStart(6, '0').toUpperCase()
            const timeStr = new Date(thought.id).toISOString().substr(11, 12)
            return (
              <motion.div 
                key={thought.id} 
                className={`thought-item ${thought.type}`}
                initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                transition={{ duration: 0.5, type: 'spring', damping: 15 }}
              >
                <div className="thought-bracket top">
                  <span>â”Œâ”€â”€</span> [ {getIcon(thought.type)} <span className="thought-type">{thought.type.toUpperCase()}</span> ] â”€ <span className="thought-hex">{hexId}</span> â”€ <span className="thought-time">{timeStr}</span>
                </div>
                
                <div className="thought-body">
                  <span className="thought-prefix">â”‚ ::</span>
                  <p className="thought-text font-mono">
                    <DecryptedText text={thought.text} />
                  </p>
                </div>

                <div className="thought-bracket bottom">
                  <span>â””â”€â”€</span> [ OK ]
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {thoughtStream.length === 0 && (
          <div className="stream-empty">
            <span className="animate-pulse">_</span> AWAITING COM-LINK...
          </div>
        )}
      </div>

      <style>{`
        .thought-stream-wrapper {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          min-height: 200px;
          position: relative;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.4);
        }

        .glitch-border {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4) inset;
        }

        .thought-stream-wrapper::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 30%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
          pointer-events: none;
          z-index: 5;
        }

        .stream-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-high);
          letter-spacing: 0.1em;
          border-bottom: 1px dashed var(--border-glass);
          padding-bottom: 0.8rem;
          z-index: 10;
        }

        .stream-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-right: 8px;
          z-index: 1;
        }

        .stream-content::-webkit-scrollbar {
          width: 2px;
        }

        .thought-item {
          display: flex;
          flex-direction: column;
          position: relative;
          color: var(--text-med);
          font-family: monospace;
          font-size: 0.8rem;
          text-shadow: 0 0 5px rgba(255,255,255,0.1);
        }

        .thought-bracket {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.8;
          white-space: nowrap;
        }

        .thought-bracket.top {
          color: inherit;
        }
        
        .thought-bracket.bottom {
          opacity: 0.5;
        }

        .thought-type {
          font-weight: bold;
          letter-spacing: 0.05em;
        }
        
        .thought-hex {
          opacity: 0.6;
        }

        .thought-time {
          opacity: 0.4;
          font-size: 0.7rem;
        }

        .thought-body {
          display: flex;
          gap: 12px;
          padding: 6px 0;
          padding-left: 2px; /* align with vertical bar */
        }

        .thought-prefix {
          opacity: 0.3;
          user-select: none;
        }

        .thought-text {
          color: var(--text-high);
          line-height: 1.5;
          letter-spacing: 0.05em;
        }

        /* â”€â”€â”€ Type Modifiers â”€â”€â”€ */
        .thought-item.reasoning { color: var(--accent); }
        .thought-item.plan { color: var(--accent-2); }
        .thought-item.action { color: #f59e0b; }
        .thought-item.result { color: #10b981; }
        .thought-item.observation { color: var(--text-med); }

        .stream-empty {
          color: var(--text-low);
          font-size: 0.8rem;
          margin-top: 1rem;
          font-weight: 700;
          letter-spacing: 0.2em;
        }
      `}</style>
    </div>
  )
}

