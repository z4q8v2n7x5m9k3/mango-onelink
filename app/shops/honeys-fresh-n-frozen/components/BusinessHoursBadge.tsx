'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Clock3, X } from 'lucide-react'

const hours = [
  ['Monday', '10:30 AM – 9:30 PM'],
  ['Tuesday', '10:30 AM – 9:30 PM'],
  ['Wednesday', '10:30 AM – 9:30 PM'],
  ['Thursday', '10:30 AM – 9:30 PM'],
  ['Friday', '10:30 AM – 9:30 PM'],
  ['Saturday', '10:30 AM – 9:30 PM'],
  ['Sunday', '11:00 AM – 9:30 PM'],
]

const formatTime = (hour: number, minute: number) => {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
}

export default function BusinessHoursBadge() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', escape)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', escape)
    }
  }, [open])

  const day = now.getDay()
  const todayIndex = (day + 6) % 7
  const minutes = now.getHours() * 60 + now.getMinutes()
  const openAt = day === 0 ? 11 * 60 : 10 * 60 + 30
  const closeAt = 21 * 60 + 30
  const isOpen = minutes >= openAt && minutes < closeAt
  const nextOpen = day === 0 ? '11:00 AM' : '10:30 AM'

  return <>
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group inline-flex h-8 w-fit max-w-full shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-left transition active:scale-95"
      style={{
        background: isOpen ? 'rgba(24,77,59,.09)' : 'rgba(217,173,73,.10)',
        color: isOpen ? '#184D3B' : '#76602E',
        borderColor: isOpen ? 'rgba(24,77,59,.28)' : 'rgba(217,173,73,.34)',
        boxShadow: isOpen ? '0 6px 14px rgba(24,77,59,.10)' : '0 6px 14px rgba(217,173,73,.10)',
      }}
      aria-label="View opening hours"
    >
      <Clock3 className="h-4 w-4 shrink-0" strokeWidth={2.3} />
      <span className="text-[11px] font-black">{isOpen ? 'Open now' : 'Closed now'}</span>
      <span className="truncate text-[9.5px] font-extrabold opacity-90">{isOpen ? '· Closes 9:30 PM' : `· Opens ${nextOpen}`}</span>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-75 transition-transform group-hover:translate-x-0.5" />
    </button>

    {mounted && createPortal(
      <AnimatePresence>
        {open && <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#101713]/55 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Mango opening hours"
            className="relative w-full max-w-[360px] overflow-hidden rounded-[30px] border border-white/75 p-5 backdrop-blur-2xl"
            style={{ background: 'linear-gradient(145deg,rgba(255,253,247,.97),rgba(234,241,233,.92))', boxShadow: '0 30px 80px rgba(10,30,20,.30),inset 0 1px 0 #fff' }}
            initial={{ y: 70, opacity: 0, scale: .95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: .97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 27 }} onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#D9AD49]/20 blur-3xl" />
            <div className="relative mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white bg-white/75 text-[#184D3B] shadow-lg"><Clock3 className="h-5 w-5" /></span>
                <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#8A6A24]">Opening hours</p><h2 className="text-[21px] font-black text-[#1B211E]">Visit Mango</h2></div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-white bg-white/75 text-[#184D3B]" aria-label="Close timings"><X className="h-4 w-4" /></button>
            </div>
            <div className="relative mb-3 flex items-center gap-2 rounded-2xl border border-[#184D3B]/10 bg-[#EAF1E9]/85 px-3 py-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-[#4E9B63] shadow-[0_0_0_4px_rgba(78,155,99,.13)]' : 'bg-[#D9AD49] shadow-[0_0_0_4px_rgba(217,173,73,.14)]'}`} />
              <p className="text-xs font-extrabold text-[#184D3B]">{isOpen ? `Open now · closes ${formatTime(21, 30)}` : 'Currently closed'}</p>
            </div>
            <div className="relative space-y-1.5">
              {hours.map(([name, time], index) => <div key={name} className="flex items-center justify-between gap-2 rounded-[14px] border px-3 py-2.5" style={{ background: index === todayIndex ? 'rgba(217,173,73,.14)' : 'rgba(255,255,255,.64)', borderColor: index === todayIndex ? 'rgba(217,173,73,.34)' : 'rgba(255,255,255,.9)' }}>
                <span className="text-[13px] font-bold text-[#26352C]">{name}{index === todayIndex && <span className="ml-2 rounded-full bg-[#184D3B] px-2 py-0.5 text-[8px] font-black uppercase text-white">Today</span>}</span>
                <span className="text-right text-[11px] font-bold text-[#657268]">{time}</span>
              </div>)}
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>, document.body
    )}
  </>
}
