// Web Audio API Synthesizer Engine
// Generates haptic audio entirely in the browser (no asset files needed)

let audioCtx = null

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
}

export const playHoverBeep = () => {
  try {
    initAudio()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.02, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.05)
  } catch (e) {}
}

export const playKeystroke = () => {
  try {
    initAudio()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.type = 'square'
    osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime)
    
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.03)
  } catch (e) {}
}

export const playExecuteImpact = () => {
  try {
    initAudio()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.3)
  } catch (e) {}
}

export const playLockdownSiren = () => {
  try {
    initAudio()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.type = 'square'
    osc.frequency.setValueAtTime(400, audioCtx.currentTime)
    // Siren sweep
    osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.5)
    osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 1.0)
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1)
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0)

    osc.start()
    osc.stop(audioCtx.currentTime + 1.0)
  } catch (e) {}
}

export const playSuccessChime = () => {
  try {
    initAudio()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, audioCtx.currentTime)
    osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1)
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.2)

    gain.gain.setValueAtTime(0, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.4)
  } catch (e) {}
}

let humOsc = null
let humGain = null
let lfoOsc = null
let lfoGain = null

export const startNeuralHum = () => {
  try {
    initAudio()
    if (humOsc) return

    humOsc = audioCtx.createOscillator()
    humGain = audioCtx.createGain()
    
    // Create LFO for "Breathing" (Modulates Volume Subtly)
    lfoOsc = audioCtx.createOscillator()
    lfoGain = audioCtx.createGain()
    
    lfoOsc.type = 'sine'
    lfoOsc.frequency.setValueAtTime(0.16, audioCtx.currentTime) // ~6s breath
    lfoGain.gain.setValueAtTime(0.008, audioCtx.currentTime) 
    
    lfoOsc.connect(lfoGain)
    lfoGain.connect(humGain.gain)

    humOsc.connect(humGain)
    humGain.connect(audioCtx.destination)

    humOsc.type = 'sine'
    humOsc.frequency.setValueAtTime(40, audioCtx.currentTime) // Low base hum
    
    humGain.gain.setValueAtTime(0, audioCtx.currentTime)
    humGain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 2) // Fade in

    humOsc.start()
    lfoOsc.start()
  } catch (e) {}
}

export const updateNeuralHum = (frequency, volume = 0.02, breathLfoHz = 0.16) => {
  if (humOsc && audioCtx) {
    humOsc.frequency.exponentialRampToValueAtTime(frequency, audioCtx.currentTime + 1)
    humGain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 1)
    if (lfoOsc) {
      lfoOsc.frequency.exponentialRampToValueAtTime(breathLfoHz, audioCtx.currentTime + 1)
    }
  }
}

export const stopNeuralHum = () => {
  if (humOsc) {
    humGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1)
    setTimeout(() => {
      if (humOsc) {
        humOsc.stop()
        lfoOsc?.stop()
        humOsc = null
        humGain = null
        lfoOsc = null
        lfoGain = null
      }
    }, 1000)
  }
}

