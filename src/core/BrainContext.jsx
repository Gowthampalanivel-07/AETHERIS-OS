import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { playSuccessChime, playExecuteImpact, startNeuralHum, updateNeuralHum, stopNeuralHum } from './SoundEngine'
import { respondTo } from './VoiceEngine'
const BrainContext = createContext()

export const useBrain = () => useContext(BrainContext)

export const BrainProvider = ({ children }) => {
  // â”€â”€â”€ Agent States â”€â”€â”€
  const [persona, setPersona] = useState('JARVIS') // JARVIS, FRIDAY, VISION, ULTRON
  const [status, setStatus] = useState('Idle') // Idle, Thinking, Acting, Listening
  const [confidence, setConfidence] = useState(0.98)
  const [activeTask, setActiveTask] = useState(null)
  
  // â”€â”€â”€ Memory & Goals â”€â”€â”€
  const [memory, setMemory] = useState([
    { id: 1, type: 'fact', content: 'User prefers dark mode and minimalist UI.', importance: 0.8 },
    { id: 2, type: 'goal', content: 'Become an elite full-stack developer.', importance: 0.95 },
  ])
  
  const [goals, setGoals] = useState([
    { id: 1, title: 'Master Python Data Science', progress: 45, status: 'Active' },
    { id: 2, title: 'Build Aetheris OS Core', progress: 10, status: 'In-Progress' },
  ])

  // ─── Thought Stream ───
  const [thoughtStream, setThoughtStream] = useState([
    { id: 1, text: 'NeuralCore boot sequence complete. All systems nominal.', type: 'system' },
    { id: 2, text: 'Loading cognitive architecture...', type: 'reasoning' },
    { id: 3, text: 'Persona JARVIS loaded. Standing by.', type: 'result' },
  ])

  // â”€â”€â”€ Sensory (Audio) Management â”€â”€â”€
  useEffect(() => {
    startNeuralHum()
    return () => stopNeuralHum()
  }, [])

  useEffect(() => {
    let freq = 40 // Base
    let vol = 0.012
    let lfoHz = 0.16 // Base 6s breath

    if (status === 'Listening') {
      lfoHz = 0.33 // 3s breath
    }
    if (status === 'Thinking') { 
      freq = 60 
      vol = 0.018
      lfoHz = 0.66 // 1.5s breath
    }
    if (status === 'Acting') { 
      freq = 75 
      vol = 0.02
      lfoHz = 1.25 // 0.8s breath
    }
    if (status === 'Lockdown') { 
      freq = 20 
      vol = 0.04
      lfoHz = 2.0 // Rapid alarm breath
    }

    // Persona modifiers
    if (persona === 'ULTRON') freq -= 10
    if (persona === 'FRIDAY') freq += 10
    if (persona === 'ASCENDED') freq += 20

    updateNeuralHum(freq, vol, lfoHz)
  }, [status, persona])

  // â”€â”€â”€ Real-time Telemetry (Sensors) â”€â”€â”€
  const [telemetry, setTelemetry] = useState({
    focusLevel: 85,
    systemLoad: 12,
    energyLevel: 92
  })

  // â”€â”€â”€ Telemetry Heartbeat â”€â”€â”€
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (Math.random() * 2 - 1))),
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + (Math.random() * 1.5 - 0.75))),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // â”€â”€â”€ Brain State Expansion â”€â”€â”€
  const [recentActivity, setRecentActivity] = useState([
    { id: 'act-0', type: 'system', text: 'NeuralCore Initialized', time: '09:00' }
  ])
  const [rippleEffect, setRippleEffect] = useState(0)

  const triggerRipple = useCallback(() => {
    setRippleEffect(prev => prev + 1)
  }, [])

  const logActivity = useCallback((text, type = 'action') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setRecentActivity(prev => [{ id: Date.now(), text, type, time }, ...prev].slice(0, 5))
  }, [])

  // ─── Agent Swarm Expansion ───
  const [agents, setAgents] = useState([
    { id: 'agent-1', name: 'Researcher', status: 'Idle', color: '#3b82f6', orbit: 120, speed: 0.5, lastPing: 0 },
    { id: 'agent-2', name: 'Architect', status: 'Idle', color: '#a855f7', orbit: 160, speed: 0.3, lastPing: 0 },
    { id: 'agent-3', name: 'Coder', status: 'Idle', color: '#10b981', orbit: 200, speed: 0.8, lastPing: 0 },
  ])

  const [memorySearch, setMemorySearch] = useState('')

  // ─── Autonomous Agent Pings ───
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === 'Idle' && Math.random() > 0.7) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)]
        setAgents(prev => prev.map(a => 
          a.name === randomAgent.name 
            ? { ...a, lastPing: Date.now(), speed: 1.2 } 
            : { ...a, speed: Math.max(0.3, a.speed - 0.1) }
        ))
        
        const pings = [
          `${randomAgent.name} performed background sub-routine scan.`,
          `${randomAgent.name} optimizing neural pathways.`,
          `${randomAgent.name} synchronized with local memory shards.`,
          `${randomAgent.name} heartbeat: All systems nominal.`
        ]
        logActivity(pings[Math.floor(Math.random() * pings.length)], 'system')
        triggerRipple()

        // Reset speed after a few seconds
        setTimeout(() => {
          setAgents(prev => prev.map(a => a.name === randomAgent.name ? { ...a, speed: 0.5 } : a))
        }, 3000)
      }
    }, 12000)
    return () => clearInterval(interval)
  }, [status, agents, logActivity, triggerRipple])

  const [history, setHistory] = useState([])
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [historicalData, setHistoricalData] = useState(null)

  const snapshotState = useCallback(() => {
    const snapshot = {
      timestamp: Date.now(),
      telemetry: { ...telemetry },
      thoughtStream: [...thoughtStream],
      status
    }
    setHistory(prev => [snapshot, ...prev].slice(0, 30))
  }, [telemetry, thoughtStream, status])

  // Periodic Snapshotting
  useEffect(() => {
    const interval = setInterval(snapshotState, 10000)
    return () => clearInterval(interval)
  }, [snapshotState])

  const syncAgents = useCallback((statusMap) => {
    setAgents(prev => prev.map(a => ({
      ...a,
      status: statusMap[a.name] || 'Idle'
    })))
  }, [])

  // â”€â”€â”€ Jarvis Core Expansion â”€â”€â”€
  const [resonance, setResonance] = useState('Beta') 
  const [pulseRate, setPulseRate] = useState(60)
  const [glitchActive, setGlitchActive] = useState(false)

  const triggerGlitch = useCallback(() => {
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 200)
  }, [])

  const orchestrateAgent = useCallback((agentId, boost = true) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, speed: boost ? 1.5 : 0.5 } : a))
    triggerRipple()
    logActivity(`Orchestrating ${agents.find(a => a.id === agentId)?.name} boost.`, 'system')
  }, [agents, triggerRipple, logActivity])

  // Sync Resonance with Persona
  useEffect(() => {
    const resonanceMap = {
      JARVIS: 'Alpha',
      FRIDAY: 'Beta',
      VISION: 'Theta',
      ULTRON: 'Gamma',
      ASCENDED: 'Gamma'
    }
    setResonance(resonanceMap[persona] || 'Delta')
  }, [persona])

  // Sync Pulse Rate with System Load
  useEffect(() => {
    const basePulse = 60
    const loadFactor = telemetry.systemLoad / 2
    const statusFactor = status === 'Thinking' ? 20 : 0
    setPulseRate(Math.round(basePulse + loadFactor + statusFactor))
  }, [telemetry.systemLoad, status])


  // â”€â”€â”€ Agent Actions â”€â”€â”€
  const think = useCallback(async (query) => {
    if (!query.trim()) return

    const lowerQuery = query.toLowerCase()

    if (status === 'Lockdown') {
      if (lowerQuery === 'override') {
        setStatus('Idle')
        playSuccessChime()
        respondTo.unlock()
        logActivity('SYSTEM UNLOCKED', 'system')
      } else {
        respondTo.lockdown()
      }
      return
    }

    // System Lockdown Override intercept
    if (lowerQuery.includes('lockdown') || lowerQuery.includes('protocol zero')) {
      setStatus('Lockdown')
      respondTo.lockdown()
      setThoughtStream(prev => [{ id: Date.now(), text: 'CRITICAL: PROTOCOL ZERO INITIATED. ALL SYSTEMS RESTRICTED.', type: 'action' }, ...prev])
      logActivity('SYSTEM LOCKDOWN ENGAGED', 'error')
      syncAgents({ Researcher: 'Idle', Architect: 'Idle', Coder: 'Idle' })
      return
    }

    setStatus('Thinking')
    respondTo.command(query)

    if (telemetry.systemLoad > 80) triggerGlitch()
    syncAgents({ Researcher: 'Working', Architect: 'Thinking' })
    triggerRipple()
    const newThought = { id: Date.now(), text: `Processing intent: "${query}"`, type: 'reasoning' }
    setThoughtStream(prev => [newThought, ...prev].slice(0, 50))
    logActivity(`Analyzing: ${query}`, 'reasoning')

    // Simulate multi-step reasoning
    await new Promise(r => setTimeout(r, 800))
    
    if (lowerQuery.includes('goal') || lowerQuery.includes('task')) {
       syncAgents({ Researcher: 'Idle', Architect: 'Working', Coder: 'Thinking' })
      setThoughtStream(prev => [{ 
        id: Date.now() + 1, 
        text: 'Analyzing current goal architecture...', 
        type: 'reasoning' 
      }, ...prev])
      await new Promise(r => setTimeout(r, 600))
    }

    setThoughtStream(prev => [{ 
      id: Date.now() + 2, 
      text: `Recommendation: Adapt ${persona} protocol for optimal execution.`, 
      type: 'plan' 
    }, ...prev])

    setStatus('Idle')
    syncAgents({ Researcher: 'Idle', Architect: 'Idle', Coder: 'Idle' })
    playSuccessChime()
    respondTo.thinkDone()
  }, [persona, triggerRipple, logActivity, syncAgents, telemetry.systemLoad, triggerGlitch])

  const execute = useCallback(async (command) => {
    // Intercept to unlock
    if (status === 'Lockdown' && command.toUpperCase() === 'OVERRIDE') {
      setStatus('Idle')
      playSuccessChime()
      speak('Protocol Zero Disengaged. Welcome back.')
      logActivity('SYSTEM UNLOCKED', 'system')
      return
    } else if (status === 'Lockdown') {
      speak('Access Denied. System is restricted under Protocol Zero.')
      return
    }

    setStatus('Acting')
    syncAgents({ Coder: 'Working' })
    triggerRipple()
    const execText = `Executing directive: ${command}`
    setThoughtStream(prev => [{ id: Date.now(), text: execText, type: 'action' }, ...prev])
    logActivity(execText, 'action')
    speak(execText)
    
    await new Promise(r => setTimeout(r, 800))

    setStatus('Idle')
    playExecuteImpact()
    syncAgents({ Coder: 'Idle' })
    triggerRipple()
    respondTo.done()
  }, [triggerRipple, logActivity, syncAgents])

  const listen = useCallback(() => {
    const isListening = status === 'Listening'
    
    if (isListening) {
      setStatus('Idle')
      syncAgents({ Researcher: 'Idle' })
      respondTo.listenOff()
      if (window.activeRecognition) window.activeRecognition.stop()
    } else {
      setStatus('Listening')
      syncAgents({ Researcher: 'Monitoring' })
      setThoughtStream(prev => [{ id: Date.now(), text: 'System Acoustic Monitoring Active...', type: 'observation' }, ...prev])
      logActivity('System monitoring active', 'system')
      respondTo.listenOn()

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setThoughtStream(prev => [{ id: Date.now()+1, text: `Transcribed Audio: "${transcript}"`, type: 'observation' }, ...prev])
          // Automatically pipe transcription into the thought engine
          think(transcript)
        }

        recognition.onerror = (event) => {
          logActivity(`Acoustic error: ${event.error}`, 'error')
          setStatus('Idle')
          syncAgents({ Researcher: 'Idle' })
        }
        
        recognition.onend = () => {
          if (status === 'Listening') {
             setStatus('Idle')
             syncAgents({ Researcher: 'Idle' })
          }
        }
        
        window.activeRecognition = recognition
        recognition.start()
      } else {
        logActivity('Speech recognition engine offline or unsupported.', 'error')
      }
    }
  }, [status, logActivity, syncAgents, think])

  const decomposeGoal = useCallback(async (goalTitle) => {
    setStatus('Thinking')
    syncAgents({ Architect: 'Working', Coder: 'Thinking' })
    triggerRipple()
    setThoughtStream(prev => [...prev, { id: Date.now(), text: `Analyzing goal: ${goalTitle}`, type: 'plan' }])
    respondTo.goalDrop(goalTitle)
    
    await new Promise(r => setTimeout(r, 1500))
    
    const tasks = [
      `Research core concepts for ${goalTitle}`,
      `Identify key dependencies and tools`,
      `Establish the first milestone`,
      `Finalize technical architecture`
    ]
    
    setThoughtStream(prev => [
      ...prev, 
      ...tasks.map((t, i) => ({ id: Date.now() + i, text: `Step ${i+1}: ${t}`, type: 'task' }))
    ])
    
    setStatus('Idle')
    syncAgents({ Architect: 'Idle', Coder: 'Idle' })
    triggerRipple()
    respondTo.thinkDone()
    return tasks
  }, [triggerRipple, syncAgents])

  const addGoal = useCallback((title) => {
    const newGoal = { id: Date.now(), title, progress: 0, status: 'Active' }
    setGoals(prev => [...prev, newGoal])
    setMemory(prev => prev.filter(m => m.content !== title)) // Remove from memory once it's a goal
    logActivity(`New Goal Set: ${title}`, 'goal')
    return newGoal
  }, [logActivity])

  const scrubHistory = useCallback((index) => {
    if (index === 0) {
      setIsScrubbing(false)
      setHistoricalData(null)
    } else {
      setIsScrubbing(true)
      setHistoricalData(history[index - 1])
    }
  }, [history])

  const value = {
    persona,
    setPersona,
    status: isScrubbing ? historicalData.status : status,
    setStatus,
    confidence,
    activeTask,
    memory,
    setMemory,
    goals,
    setGoals,
    telemetry: isScrubbing ? historicalData.telemetry : telemetry,
    thoughtStream: isScrubbing ? historicalData.thoughtStream : thoughtStream,
    recentActivity,
    rippleEffect,
    agents,
    history,
    isScrubbing,
    scrubHistory,
    resonance,
    pulseRate,
    glitchActive,
    triggerGlitch,
    orchestrateAgent,
    triggerRipple,
    think,
    execute,
    listen,
    decomposeGoal,
    addGoal,
    handleGoalDrop: useCallback(async (goal) => {
      setStatus('Thinking')
      triggerRipple()
      setThoughtStream(prev => [...prev, { 
        id: Date.now(), 
        text: `Spatial engagement detected: Analyzing ${goal.title}`, 
        type: 'plan' 
      }])
      
      // Simulate specialized "Spatial Analysis"
      await new Promise(r => setTimeout(r, 1000))
      await decomposeGoal(goal.title)
    }, [decomposeGoal, triggerRipple]),
    
    taskAgent: useCallback((name, task) => {
      setAgents(prev => prev.map(a => a.name === name ? { ...a, status: task, speed: 1.8 } : a))
      setThoughtStream(prev => [{ id: Date.now(), text: `${name} assigned to: ${task}`, type: 'system' }, ...prev])
      logActivity(`${name} manual override: ${task}`, 'action')
      triggerRipple()
      
      setTimeout(() => {
        setAgents(prev => prev.map(a => a.name === name ? { ...a, status: 'Idle', speed: 0.5 } : a))
      }, 5000)
    }, [logActivity, triggerRipple]),

    memorySearch,
    setMemorySearch,
    getMemoryRelations: useCallback((id) => {
      const source = memory.find(m => m.id === id)
      if (!source) return []
      return memory.filter(m => m.id !== id && (m.type === source.type || m.content.split(' ').some(word => source.content.includes(word))))
    }, [memory])
  }

  return (
    <BrainContext.Provider value={value}>
      {children}
    </BrainContext.Provider>
  )
}

