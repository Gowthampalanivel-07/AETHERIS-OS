import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react'
import { playLockdownSiren } from '../core/SoundEngine'

export default function LockdownHUD() {
  useEffect(() => {
    playLockdownSiren() // play immediately
    const intv = setInterval(playLockdownSiren, 1000)
    return () => clearInterval(intv)
  }, [])

  return (
    <motion.div 
      className="lockdown-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="lockdown-scanlines"></div>
      
      <motion.div 
        className="alarm-flasher"
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />

      <div className="lockdown-content">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <ShieldAlert size={120} className="text-red-600 mb-6 drop-shadow-[0_0_50px_rgba(220,38,38,0.8)]" />
        </motion.div>

        <h1 className="lockdown-title tracking-[0.3em] text-red-500 font-black text-6xl">PROTOCOL ZERO</h1>
        <h2 className="lockdown-subtitle tracking-widest text-red-400 mt-2 text-2xl font-bold">CRITICAL DEFENSE LOCKDOWN ENGAGED</h2>

        <div className="lockdown-divider" />

        <div className="lockdown-warnings mt-10 space-y-4 font-mono text-red-500">
          <div className="flex items-center justify-center gap-3"><AlertTriangle /> ALL NON-ESSENTIAL SUBSYSTEMS TERMINATED</div>
          <div className="flex items-center justify-center gap-3"><Lock /> NEURAL UPLINK SEVERED. NETWORK QUARANTINED.</div>
        </div>

        <div className="lockdown-hint mt-20 p-4 border border-red-900 bg-red-950/30 rounded font-mono text-red-400">
          TYPE OR SPEAK <span className="text-white font-bold animate-pulse">"OVERRIDE"</span> IN THE OMNI-BAR TO DISENGAGE
        </div>
      </div>

      <style>{`
        .lockdown-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          backdrop-filter: blur(20px);
          pointer-events: none; /* Let clicks pass to Command Bar so user can type Override */
        }

        .lockdown-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(220, 38, 38, 0.05) 3px,
            rgba(220, 38, 38, 0.05) 4px
          );
          pointer-events: none;
        }

        .alarm-flasher {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 50%, rgba(220,38,38,0.4) 100%);
          pointer-events: none;
        }

        .lockdown-content {
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lockdown-title {
          text-shadow: 0 0 30px rgba(220, 38, 38, 0.8), 0 0 10px rgba(220, 38, 38, 1);
        }

        .lockdown-divider {
          width: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220,38,38,0.5), transparent);
          margin: 2rem 0;
        }
      `}</style>
    </motion.div>
  )
}

