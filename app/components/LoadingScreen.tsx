'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Leaf, UtensilsCrossed } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.025, transition: { duration: 0.28, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#1B211E] px-6"
      aria-label="Loading Mango"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[43%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9AD49]/[.12] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,rgba(255,253,247,0.07),transparent_48%)]" />
      </div>

      <div className="relative flex h-[390px] w-full max-w-[390px] flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.72, y: 12 }}
          animate={{ opacity: [0, 1, 1, 1], scale: [0.72, 1, 1.04, 1], y: [12, 0, 0, 0] }}
          transition={{ duration: 0.8, times: [0, 0.32, 0.7, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="relative mt-5 h-[142px] w-[156px] drop-shadow-[0_18px_34px_rgba(0,0,0,.38)]"
        >
          <Image src="/components/fff.png" alt="Mango" fill priority className="object-contain" sizes="156px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 9 }}
          animate={{ opacity: [0, 0, 1, 1], y: [9, 9, 0, 0] }}
          transition={{ duration: 0.86, times: [0, 0.36, 0.7, 1], ease: 'easeOut' }}
          className="mt-3 text-center"
        >
          <p className="font-serif text-[31px] font-bold leading-none tracking-[0.17em] text-[#FFFDF7]">MANGO</p>
          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.23em] text-[#D9AD49]">Freshly Prepared</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-[#D9AD49]" aria-hidden>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#D9AD49]/35 bg-white/[.04]"><Leaf className="h-4 w-4" /></span>
            <span className="h-px w-8 bg-[#D9AD49]/45" />
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#D9AD49]/35 bg-white/[.04]"><UtensilsCrossed className="h-4 w-4" /></span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 0, 1, 1], y: [8, 8, 0, 0] }}
          transition={{ duration: 0.9, times: [0, 0.66, 0.82, 1], ease: 'easeOut' }}
          className="absolute bottom-1 left-0 right-0 z-20 text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/75">Loading your experience</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Mango · Fresh flavours await</p>
          <div className="mt-4 flex items-center justify-center gap-1.5" aria-label="Loading">
            {[0, 1, 2].map((dot) => (
              <motion.span key={dot} className="h-1.5 w-1.5 rounded-full bg-[#D9AD49]" animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 0.75, repeat: Infinity, delay: dot * 0.14 }} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
