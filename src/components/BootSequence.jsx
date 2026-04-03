import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hexagon, Scan } from 'lucide-react'

export default function BootSequence({ onComplete }) {
  const [phase, setPhase] = useState('idle')
  const [hash, setHash] = useState('0x00000000000000000000')
  const hasStartedRef = useRef(false)
  const hasSpokeRef   = useRef(false)

  // ─── ElevenLabs config ───────────────────────────────────────────
  // Sign up free at https://elevenlabs.io → Profile → API Key
  // Paste your key below. Leave empty to use browser voice fallback.
  const ELEVENLABS_KEY     = 'sk_0f8f860446bb82c65486dd44017f6ea4f3fbe69a9e76b63a'
  const ELEVENLABS_VOICE   = 'N2lVS1w4EtoT3dr4eOWO' // Callum — intense, cinematic
  // ─────────────────────────────────────────────────────────────────

  // Build the greeting text once
  const buildGreeting = () => {
    const now     = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    return `Welcome back, Gowtham. It is ${timeStr} on ${dateStr}. All neural pathways are nominal. Aetheris is... online.`
  }

  // Apply Web Audio FX chain to an HTMLAudioElement for that metallic Ultron quality
  const applyUltronFX = (audioEl) => {
    try {
      const ctx      = new (window.AudioContext || window.webkitAudioContext)()
      const source   = ctx.createMediaElementSource(audioEl)

      // 1. Subtle distortion — adds harmonic grit
      const distortion = ctx.createWaveShaper()
      const samples    = 512
      const curve      = new Float32Array(samples)
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1
        curve[i] = x < 0
          ? -Math.pow(Math.abs(x), 0.7)
          :  Math.pow(x, 0.7)
      }
      distortion.curve      = curve
      distortion.oversample = '2x'

      // 2. Bandpass filter — Ultron's mid-range metallic resonance (~2kHz)
      const bandpass           = ctx.createBiquadFilter()
      bandpass.type            = 'peaking'
      bandpass.frequency.value = 2200
      bandpass.Q.value         = 1.2
      bandpass.gain.value      = 5

      // 3. Short reverb impulse — cinematic space
      const convolver    = ctx.createConvolver()
      const bufLen       = ctx.sampleRate * 0.8
      const impulse      = ctx.createBuffer(2, bufLen, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch)
        for (let i = 0; i < bufLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3)
        }
      }
      convolver.buffer = impulse

      // Mix: wet reverb at 20%, dry at 100%
      const dryGain  = ctx.createGain(); dryGain.gain.value  = 1.0
      const wetGain  = ctx.createGain(); wetGain.gain.value  = 0.2

      source.connect(distortion)
      distortion.connect(bandpass)
      bandpass.connect(dryGain)
      bandpass.connect(convolver)
      convolver.connect(wetGain)
      dryGain.connect(ctx.destination)
      wetGain.connect(ctx.destination)
    } catch (e) {
      // FX chain failed — still plays unprocessed
    }
  }

  // ElevenLabs TTS path
  const speakViaElevenLabs = async (text) => {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE}`,
      {
        method:  'POST',
        headers: {
          'xi-api-key':   ELEVENLABS_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability:        0.35,  // slight instability = menacing variation
            similarity_boost: 0.85,
            style:            0.65,
            use_speaker_boost: true,
          },
        }),
      }
    )
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`)
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const audio = new Audio(url)
    applyUltronFX(audio)
    audio.play()
  }

  // Browser SpeechSynthesis fallback (deepest available voice)
  const speakViaBrowser = (text) => {
    if (!window.speechSynthesis) return
    const doSpeak = () => {
      const voices    = window.speechSynthesis.getVoices()
      const utterance = new SpeechSynthesisUtterance(text)
      const voice     = voices.find(v =>
        v.name.includes('David') || v.name.includes('Mark') ||
        v.name.includes('Daniel') || v.name.includes('Alex')
      )
      if (voice) utterance.voice = voice
      utterance.pitch  = 0.4
      utterance.rate   = 0.78
      utterance.volume = 1.0
      const guard = setInterval(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      }, 800)
      utterance.onend   = () => clearInterval(guard)
      utterance.onerror = () => clearInterval(guard)
      window.speechSynthesis.speak(utterance)
    }
    window.speechSynthesis.getVoices().length > 0
      ? doSpeak()
      : (window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null })
  }

  // ─── Main entry point ───
  const speakUltronWelcome = () => {
    if (hasSpokeRef.current) return
    hasSpokeRef.current = true
    const text = buildGreeting()
    if (ELEVENLABS_KEY) {
      speakViaElevenLabs(text).catch(() => speakViaBrowser(text))
    } else {
      speakViaBrowser(text)
    }
  }

  // ─── User click → unlock audio + start sequence ───
  const handleInitiate = () => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    // Register user gesture with a silent utterance to unlock Web Speech API
    if (window.speechSynthesis) {
      const unlock = new SpeechSynthesisUtterance(' ')
      unlock.volume = 0
      unlock.rate   = 10
      window.speechSynthesis.speak(unlock)
    }

    setPhase('scan')

    // ── All timers set ONCE here — NOT inside useEffect so they
    //    are never cancelled by phase-change re-renders ──
    const hashInterval = setInterval(() => {
      setHash('0x' + Array.from({length: 16},
        () => Math.floor(Math.random() * 16).toString(16)
      ).join('').toUpperCase())
    }, 50)

    setTimeout(() => setPhase('verify'), 2500)

    setTimeout(() => {
      setPhase('granted')
      setHash('MATCH: OMEGA-CLASS AUTHORITY')
      clearInterval(hashInterval)
      setTimeout(speakUltronWelcome, 600)
    }, 4500)

    setTimeout(() => setPhase('boot'), 6500)
    setTimeout(() => onComplete(), 7200)
  }

  return (
    <AnimatePresence mode="wait">
      {/* ─── IDLE: Click to initiate ─── */}
      {phase === 'idle' && (
        <motion.div
          key="idle"
          className="boot-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          onClick={handleInitiate}
          style={{ cursor: 'pointer' }}
        >
          <div className="boot-scanlines" />
          <div className="idle-center">
            {/* Pulsing outer ring */}
            <motion.div
              className="idle-ring outer"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="idle-ring mid"
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            {/* Core circle */}
            <motion.div
              className="idle-core"
              animate={{ boxShadow: ['0 0 20px #ef444440', '0 0 50px #ef444480', '0 0 20px #ef444440'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Text */}
            <div className="idle-label">AETHERIS OS</div>
            <motion.div
              className="idle-prompt"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              CLICK ANYWHERE TO INITIATE
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ─── BOOT SEQUENCE ─── */}
      {(phase !== 'idle' && phase !== 'boot') && (
        <motion.div
          key="boot"
          className="boot-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Hardware Scanlines Overhead */}
          <div className="boot-scanlines" />

          {/* Biometric HUD */}
          <div className="biometric-hud">
            
            <motion.div 
              className="retinal-scanner"
              animate={{ 
                scale: phase === 'granted' ? 1.2 : [1, 1.05, 1],
                borderColor: phase === 'granted' ? '#10b981' : '#ef4444'
              }}
              transition={{ duration: 0.5, repeat: phase === 'scan' ? Infinity : 0 }}
            >
              <motion.div 
                className="scanner-line"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <Scan size={100} className={phase === 'granted' ? 'text-emerald-500' : 'text-red-500 opacity-50'} strokeWidth={1} />
            </motion.div>

            <div className="auth-logs">
              <div className="auth-status">
                {phase === 'scan' && 'INITIATING RETINAL SCAN...'}
                {phase === 'verify' && 'DECRYPTING BIOMETRICS...'}
                {phase === 'granted' && <span className="text-emerald-500">AUTHORIZATION GRANTED</span>}
              </div>
              
              <div className={`auth-hash ${phase === 'granted' ? 'text-accent' : 'text-low'}`}>
                {hash}
              </div>

              <AnimatePresence>
                {phase === 'granted' && (
                  <motion.div 
                    className="welcome-user text-high"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    WELCOME BACK, GOWTHAM.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Global styles for boot sequence
const styles = document.createElement('style')
styles.innerHTML = `
  .boot-container {
    position: fixed;
    inset: 0;
    background: #010103;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', monospace;
    overflow: hidden;
  }

  .boot-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.4) 3px,
      rgba(0, 0, 0, 0.4) 4px
    );
    z-index: 10;
    pointer-events: none;
  }

  .biometric-hud {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    z-index: 20;
  }

  .retinal-scanner {
    position: relative;
    width: 200px;
    height: 200px;
    border: 2px dashed #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: radial-gradient(circle at center, rgba(239, 68, 68, 0.1), transparent 70%);
  }

  .scanner-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #ef4444;
    box-shadow: 0 0 20px 5px rgba(239, 68, 68, 0.5);
    z-index: 5;
  }

  .auth-logs {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .auth-status {
    font-size: 1.2rem;
    letter-spacing: 0.2em;
    color: var(--text-med);
  }

  .auth-hash {
    font-size: 0.9rem;
    font-family: monospace;
    letter-spacing: 0.1em;
  }

  .welcome-user {
    font-size: 1.5rem;
    letter-spacing: 0.3em;
    margin-top: 1rem;
    text-shadow: 0 0 15px rgba(255,255,255,0.8);
  }

  /* ─── Idle Splash Screen ─── */
  .idle-center {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    z-index: 20;
  }

  .idle-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid #ef4444;
    pointer-events: none;
  }

  .idle-ring.outer {
    width: 320px;
    height: 320px;
  }

  .idle-ring.mid {
    width: 240px;
    height: 240px;
  }

  .idle-core {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle at center, #ef444466, #ef444411);
    border: 2px solid #ef4444;
    box-shadow: 0 0 30px #ef444480;
    margin-bottom: 1rem;
  }

  .idle-label {
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: 0.4em;
    color: #e2e8f0;
    text-shadow: 0 0 20px rgba(255,255,255,0.4);
    margin-top: 140px;
  }

  .idle-prompt {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    color: #ef4444;
    text-transform: uppercase;
  }
`
document.head.appendChild(styles)

