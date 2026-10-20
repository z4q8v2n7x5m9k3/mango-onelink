'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#1B211E] px-6"
      aria-label="Loading Mango"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[44%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#184D3B]/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.045),transparent_48%)]" />
      </div>

      <div className="relative flex h-[360px] w-full max-w-[390px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.24, y: 16 }}
          animate={{ opacity: [0, 1, 1, 1], scale: [0.24, 0.72, 1.06, 1], y: [16, 3, 0, 0] }}
          transition={{ duration: 1.05, times: [0, 0.38, 0.78, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="relative w-[min(78vw,330px)] drop-shadow-[0_16px_30px_rgba(0,0,0,.30)]"
        >
          <Image
            src="/mango-logo.png"
            alt="Mango"
            width={1473}
            height={396}
            priority
            className="h-auto w-full object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 0, 1, 1], y: [8, 8, 0, 0] }}
          transition={{ duration: 0.9, times: [0, 0.48, 0.78, 1], ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/75">Loading your experience</p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.1em] text-white/40">Fresh flavours are on their way</p>
          <div className="mt-4 flex items-center justify-center gap-1.5" aria-label="Loading">
            {[0, 1, 2].map((dot) => <motion.span key={dot} className="h-1.5 w-1.5 rounded-full bg-[#D9AD49]/75" animate={{ opacity: [0.28, 0.85, 0.28], scale: [0.85, 1.1, 0.85] }} transition={{ duration: 0.85, repeat: Infinity, delay: dot * 0.15 }} />)}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
