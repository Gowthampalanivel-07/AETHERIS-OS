import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BrainProvider } from './core/BrainContext'
import SpaceHub from './components/SpaceHub'
import BootSequence from './components/BootSequence'
import CursorSystem from './components/CursorSystem'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const [hasBooted, setHasBooted] = useState(false)

  return (
    <Router>
      <BrainProvider>
        <CursorSystem />
        <AnimatePresence mode="wait">
          {!hasBooted && (
            <motion.div key="boot" exit={{ opacity: 0, filter: 'blur(20px)' }} transition={{ duration: 0.8 }}>
              <BootSequence onComplete={() => setHasBooted(true)} />
            </motion.div>
          )}
          
          {hasBooted && (
            <motion.div key="hub" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100vh', width: '100vw' }}>
              <Routes>
                <Route path="/" element={<SpaceHub />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </BrainProvider>
    </Router>
  )
}

export default App
