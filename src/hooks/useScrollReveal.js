import { useEffect, useRef, useState } from 'react'

/**
 * useScrollReveal - triggers visibility when element enters viewport
 * @param {object} options - IntersectionObserver options + custom flags
 * @param {number} options.threshold - 0-1 visibility ratio before trigger (default: 0.15)
 * @param {string} options.rootMargin - CSS margin string (default: '0px')
 * @param {boolean} options.repeat - re-trigger on scroll out then back in (default: false)
 * @param {boolean} options.once - trigger only once (default: true)
 */
export default function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (!options.repeat) observer.disconnect()
        } else if (options.repeat) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.repeat])

  return [ref, isVisible]
}

/**
 * useStaggerReveal - returns refs for multiple children, each triggered sequentially
 * Useful for lists/grids where each item reveals after the previous
 */
export function useStaggerReveal(count, baseDelay = 0.08) {
  const [visibleSet, setVisibleSet] = useState(new Set())
  const refs = useRef([])

  useEffect(() => {
    refs.current = refs.current.slice(0, count)
    const observers = []

    refs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSet(prev => new Set([...prev, i]))
            }, i * baseDelay * 1000)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [count, baseDelay])

  const getRef = (i) => el => { refs.current[i] = el }
  const isVisible = (i) => visibleSet.has(i)

  return { getRef, isVisible }
}
