import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useBrain } from '../core/BrainContext'
import { Search, Info, Link2, Clock, Tag } from 'lucide-react'

export default function MemoryGraph({ isIdle }) {
  const { memory, memorySearch, setMemorySearch, getMemoryRelations } = useBrain()
  const [focusedId, setFocusedId] = useState(null)
  
  // Mouse drift physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      mouseX.set((clientX - window.innerWidth / 2) / 25)
      mouseY.set((clientY - window.innerHeight / 2) / 25)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Fibonacci sphere distribution with real-time filtering
  const nodes = useMemo(() => {
    const filtered = memory.filter(m => 
      m.content.toLowerCase().includes(memorySearch.toLowerCase())
    )
    const N = Math.max(filtered.length, 1)
    const radius = 180
    const phi = Math.PI * (3 - Math.sqrt(5)) 

    return filtered.map((m, i) => {
      const y = 1 - (i / (N - 1)) * 2 || 0
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * i
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      return {
        ...m,
        x: x * radius,
        y: y * radius,
        z: z * radius
      }
    })
  }, [memory, memorySearch])

  const focusedNode = useMemo(() => nodes.find(n => n.id === focusedId), [nodes, focusedId])
  const relations = useMemo(() => focusedId ? getMemoryRelations(focusedId) : [], [focusedId, getMemoryRelations])

  return (
    <div className="memory-graph-container" style={{ opacity: isIdle ? 0.2 : 1 }}>
      {/* ─── Top Left: Search & Filter ─── */}
      <div className="memory-search-container glass-panel">
        <Search size={14} className="text-low" />
        <input 
          type="text" 
          placeholder="SEARCH MEMORY SHARDS..." 
          value={memorySearch}
          onChange={(e) => setMemorySearch(e.target.value)}
        />
        <div className="text-[10px] opacity-30 font-bold ml-2">{nodes.length} NODES</div>
      </div>

      {/* ─── Bottom Right: Detail Panel ─── */}
      <AnimatePresence>
        {focusedNode && (
          <motion.div 
            className="memory-detail-panel glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full bg-${focusedNode.type === 'fact' ? 'accent' : 'warning'} glow-sm`} />
              <div className="text-xs font-black tracking-widest uppercase">Memory Insight</div>
            </div>
            
            <div className="text-lg font-bold mb-4 leading-tight text-white">
              "{focusedNode.content}"
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <Clock size={12} />
                <span>INDEXED: 2h ago</span>
              </div>
              <div className="meta-item">
                <Tag size={12} />
                <span className="capitalize">TYPE: {focusedNode.type}</span>
              </div>
              <div className="meta-item">
                <Link2 size={12} />
                <span>RELATIONS: {relations.length} Found</span>
              </div>
            </div>
            
            <button className="btn-action-sm mt-4 w-full" onClick={() => setFocusedId(null)}>CLOSE SHARD</button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="sphere-wrapper"
        style={{ 
          transformStyle: 'preserve-3d',
          x: springX,
          y: springY
        }}
        animate={{ 
          rotateY: focusedId ? 0 : [0, 360],
          rotateX: focusedId ? 0 : [0, 180, 0]
        }}
        transition={{ 
          rotateY: { duration: 60, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 90, repeat: Infinity, ease: "linear" }
        }}
      >
        {/* 🪄 Relation Lines */}
        <div className="relation-lines">
          {focusedId && nodes.map((m) => {
            const isRelated = relations.some(r => r.id === m.id)
            if (!isRelated || m.id === focusedId) return null
            
            const dx = m.x - focusedNode.x
            const dy = m.y - focusedNode.y
            const dz = m.z - focusedNode.z
            const length = Math.sqrt(dx*dx + dy*dy + dz*dz)
            const rotY = Math.atan2(dz, dx) * (180 / Math.PI)
            const rotZ = Math.asin(dy / length) * (180 / Math.PI)

            return (
              <motion.div
                key={`line-${m.id}`}
                className="memory-line"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.4, scaleX: 1 }}
                style={{
                  width: length,
                  left: focusedNode.x,
                  top: focusedNode.y,
                  transform: `translateZ(${focusedNode.z}px) rotateY(${-rotY}deg) rotateZ(${rotZ}deg)`,
                  transformOrigin: '0 0'
                }}
              />
            )
          })}
        </div>

        <AnimatePresence>
          {nodes.map((m) => (
            <motion.div
              key={m.id}
              className={`memory-node-spatial ${m.type} ${focusedId === m.id ? 'focused' : ''}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: focusedId && focusedId !== m.id && !relations.some(r => r.id === m.id) ? 0.1 : 1, 
                scale: focusedId === m.id ? 1.3 : 1,
                x: "-50%",
                y: "-50%",
                z: focusedId === m.id ? m.z + 100 : m.z
              }}
              style={{
                left: `${m.x}px`,
                top: `${m.y}px`,
              }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.15, z: m.z + 20 }}
              onClick={() => setFocusedId(focusedId === m.id ? null : m.id)}
            >
              <div className={`node-glow ${m.type}`} />
              <span className="node-content text-[10px]">{m.content}</span>
              
              {focusedId === m.id && (
                <motion.div 
                  className="focus-ring"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .memory-graph-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 1500px;
        }

        .memory-search-container {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.6rem 1.2rem;
          z-index: 100;
          width: 320px;
        }

        .memory-search-container input {
          background: transparent;
          border: none;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1rem;
          width: 100%;
          outline: none;
        }

        .memory-detail-panel {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 300px;
          padding: 1.5rem;
          z-index: 100;
          border: 1px solid var(--accent);
        }

        .detail-meta {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
        }

        .sphere-wrapper {
          position: relative;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
        }

        .memory-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, var(--accent), transparent);
          transform-origin: 0 0;
          pointer-events: none;
        }

        .memory-node-spatial {
          position: absolute;
          padding: 0.8rem 1.2rem;
          background: rgba(10, 10, 15, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          transition: border-color 0.4s;
          transform-style: preserve-3d;
          white-space: nowrap;
        }

        .memory-node-spatial.focused {
          border-color: var(--accent);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 40px var(--accent-glow);
          z-index: 1000;
        }

        .focus-ring {
          position: absolute;
          inset: -8px;
          border: 1px solid var(--accent);
          border-radius: 18px;
          pointer-events: none;
        }

        .node-glow {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .node-glow.fact { background: #6366f1; box-shadow: 0 0 12px #6366f1; }
        .node-glow.goal { background: #f59e0b; box-shadow: 0 0 12px #f59e0b; }

        .btn-action-sm {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-high);
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.6rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-action-sm:hover {
          background: var(--accent);
          border-color: white;
        }
      `}</style>
    </div>
  )
}
