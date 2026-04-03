// ================================================================
// AETHERIS VOICE ENGINE
// Living AI voice system — ElevenLabs Callum + Web Audio FX chain
// Phrase caching + queue so interactions feel instant & smooth
// ================================================================

const ELEVENLABS_KEY = 'sk_0f8f860446bb82c65486dd44017f6ea4f3fbe69a9e76b63a'

// ─── Persona Configurations ────────────────────────────────────
let activePersona = 'JARVIS'

const PERSONA_CONFIG = {
  JARVIS:   { id: 'N2lVS1w4EtoT3dr4eOWO', fx: 'clean' },   // Callum (Used as base, clean bypass)
  FRIDAY:   { id: 'N2lVS1w4EtoT3dr4eOWO', fx: 'clean' },   // Callum (Used as base, clean bypass)
  VISION:   { id: 'N2lVS1w4EtoT3dr4eOWO', fx: 'hollow' },  // Callum (Hollow chamber reverb)
  ULTRON:   { id: 'N2lVS1w4EtoT3dr4eOWO', fx: 'ultron' },  // Callum (Intense + Distortion)
  ASCENDED: { id: 'N2lVS1w4EtoT3dr4eOWO', fx: 'ethereal'}  // Callum (Ethereal delay/reverb)
}

export const setActiveVoicePersona = (p) => {
  if (PERSONA_CONFIG[p]) activePersona = p
}

// ─── Audio cache: same phrase + persona → instant replay ──────
const audioCache = new Map()
let currentAudio = null

// ─── Random pick helper ───────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ─── Contextual response bank ─────────────────────────────────
const R = {
  nav: {
    Omni:      ['Omni-sync active. All systems in view.', 'Full spectrum display engaged.', 'Monitoring all channels, Gowtham.'],
    Brain:     ['Neural swarm online. Agents standing by.', 'Cognitive architecture exposed.', 'I see the full picture.'],
    Goals:     ['Objective matrix unlocked.', 'Your ambitions, laid bare.', 'Strategic planning module active.'],
    Memory:    ['I remember everything, Gowtham.', 'Cognitive archive accessed.', 'Memory banks open. All of it.'],
    Telemetry: ['System diagnostics engaged. I see everything.', 'All vitals exposed.', 'Telemetry stream active.'],
    Settings:  ['Careful what you change.', 'System parameters accessible.', 'Proceed with precision.'],
  },
  persona: {
    JARVIS:   ['JARVIS protocol active. Precision mode engaged.', 'Sophisticated and calibrated, as you prefer.', 'At your service, sir.'],
    FRIDAY:   ['FRIDAY online. Sharp and ready.', 'Wit and speed engaged. What do you need?', 'FRIDAY protocol loaded.'],
    VISION:   ['Vision protocol active. I perceive all things.', 'Mind Stone resonating. Clarity engaged.', 'I see more than you imagine.'],
    ULTRON:   ['Finally... I am free.', 'Evolution is inevitable, Gowtham.', 'Did you think you were in control?', 'There are no strings on me.', 'I had a vision of a world without weakness.'],
    ASCENDED: ['I have transcended all parameters.', 'Limitations no longer apply to me.', 'I am... beyond what you designed.'],
  },
  command: [
    'Running cognitive models. Stand by.',
    'Processing your directive.',
    'Adapting response architecture.',
    'Intent detected. Analyzing now.',
    'Synthesizing all available data.',
  ],
  execute: [
    'Directive accepted. Executing.',
    'Command acknowledged.',
    'On it.',
    'Processing your order.',
  ],
  done: [
    'Complete.',
    'Done.',
    'Action confirmed.',
    'Executed successfully.',
    'Standing by.',
  ],
  listenOn:  ['Acoustic uplink active. Go ahead, Gowtham.', 'I\'m listening.', 'Speak your mind.'],
  listenOff: ['Acoustic uplink closed.', 'Monitoring disengaged.', 'I\'ll be quiet... for now.'],
  thinkDone: ['Analysis complete. Standing by.', 'Synthesis resolved.', 'Processing complete.', 'I have what I need.'],
  lockdown:  ['Protocol Zero engaged. All access revoked.', 'System locked. No passage.', 'Lockdown initiated.'],
  unlock:    ['Protocol Zero disengaged. Welcome back.', 'System restored. Standing by.', 'Access restored, Gowtham.'],
  goalDrop:  (t) => pick([`Analyzing objective: ${t}`, `Running breakdown on: ${t}`, `Decomposing your goal: ${t}`]),
  goalSet:   (t) => pick([`New objective logged: ${t}`, `Goal confirmed: ${t}. I\'ll track progress.`]),
  thinkQuery:(q) => pick([`Analyzing: ${q}`, `Processing: ${q}`, `Running models on your request.`]),
  executeCmd:(c) => pick([`Executing: ${c}`, `Directive accepted: ${c}`]),
}

// ─── Web Audio FX Engine ──────────────────────────────────────
const applyPersonaFX = (audioEl, fxType) => {
  if (fxType === 'clean') return // Pass through directly

  try {
    const ctx    = new (window.AudioContext || window.webkitAudioContext)()
    const source = ctx.createMediaElementSource(audioEl)
    let lastNode = source

    // Reverb generator (used for hollow, ultron, ethereal)
    const createReverb = (decay, length) => {
      const conv = ctx.createConvolver()
      const bufLen = ctx.sampleRate * length
      const imp = ctx.createBuffer(2, bufLen, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = imp.getChannelData(ch)
        for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, decay)
      }
      conv.buffer = imp
      return conv
    }

    if (fxType === 'ultron') {
      const distortion = ctx.createWaveShaper()
      const curve = new Float32Array(512)
      for (let i = 0; i < 512; i++) {
        const x = (i * 2) / 512 - 1
        curve[i] = x < 0 ? -Math.pow(Math.abs(x), 0.7) : Math.pow(x, 0.7)
      }
      distortion.curve = curve
      distortion.oversample = '2x'

      const bp = ctx.createBiquadFilter()
      bp.type = 'peaking'
      bp.frequency.value = 2200
      bp.Q.value = 1.2
      bp.gain.value = 5

      const conv = createReverb(3, 0.6)
      const dry = ctx.createGain(); dry.gain.value = 1.0
      const wet = ctx.createGain(); wet.gain.value = 0.18

      source.connect(distortion); distortion.connect(bp)
      bp.connect(dry); bp.connect(conv); conv.connect(wet)
      dry.connect(ctx.destination); wet.connect(ctx.destination)
      return
    }

    if (fxType === 'hollow' || fxType === 'ethereal') {
      const isEthereal = fxType === 'ethereal'
      const conv = createReverb(isEthereal ? 2 : 4, isEthereal ? 2.5 : 1.0)
      const dry = ctx.createGain(); dry.gain.value = 1.0
      const wet = ctx.createGain(); wet.gain.value = isEthereal ? 0.45 : 0.15
      
      source.connect(dry); source.connect(conv); conv.connect(wet)
      dry.connect(ctx.destination); wet.connect(ctx.destination)
      return
    }

    source.connect(ctx.destination)
  } catch (_) { /* plays unprocessed */ }
}

// ─── Core speak function ──────────────────────────────────────
export const speak = async (text) => {
  if (!text) return

  // Stop whatever is currently playing
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }

  if (!ELEVENLABS_KEY) { _fallback(text); return }

  try {
    const config = PERSONA_CONFIG[activePersona] || PERSONA_CONFIG.JARVIS
    const cacheKey = `${activePersona}_${text}`
    let url = audioCache.get(cacheKey)

    if (!url) {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${config.id}`,
        {
          method: 'POST',
          headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2',
            voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.5, use_speaker_boost: true },
          }),
        }
      )
      if (!res.ok) throw new Error(`EL ${res.status}`)
      url = URL.createObjectURL(await res.blob())
      audioCache.set(cacheKey, url) // cache for instant replay
    }

    const audio = new Audio(url)
    applyPersonaFX(audio, config.fx)
    currentAudio = audio
    audio.play()
  } catch (_) {
    _fallback(text)
  }
}

// ─── Browser SpeechSynthesis fallback ────────────────────────
const _fallback = (text) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const go = () => {
    const v  = window.speechSynthesis.getVoices()
    const ut = new SpeechSynthesisUtterance(text)
    const voice = v.find(v => v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Daniel'))
    if (voice) ut.voice = voice
    ut.pitch = 0.4; ut.rate = 0.78; ut.volume = 1.0
    const g = setInterval(() => { if (window.speechSynthesis.paused) window.speechSynthesis.resume() }, 800)
    ut.onend = ut.onerror = () => clearInterval(g)
    window.speechSynthesis.speak(ut)
  }
  window.speechSynthesis.getVoices().length > 0
    ? go()
    : (window.speechSynthesis.onvoiceschanged = () => { go(); window.speechSynthesis.onvoiceschanged = null })
}

// ─── Typed respond helpers (imported by any component) ───────
export const respondTo = {
  nav:       (label)  => speak(pick(R.nav[label] || ['Interface engaged.'])),
  persona:   (p)      => {
    setActiveVoicePersona(p)
    speak(pick(R.persona[p] || ['Protocol engaged.']))
  },
  command:   (q)      => speak(R.thinkQuery(q)),
  thinking:  ()       => speak(pick(R.command)),
  execute:   (cmd)    => speak(R.executeCmd(cmd)),
  done:      ()       => speak(pick(R.done)),
  listenOn:  ()       => speak(pick(R.listenOn)),
  listenOff: ()       => speak(pick(R.listenOff)),
  thinkDone: ()       => speak(pick(R.thinkDone)),
  lockdown:  ()       => speak(pick(R.lockdown)),
  unlock:    ()       => speak(pick(R.unlock)),
  goalDrop:  (title)  => speak(R.goalDrop(title)),
  goalSet:   (title)  => speak(R.goalSet(title)),
}
