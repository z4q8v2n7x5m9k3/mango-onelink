'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const reasons = [
  { title: '100% Vegetarian', description: 'Delicious vegetarian food, made for everyone.', image: '/gallery/unnamed.webp' },
  { title: 'Freshly Prepared', description: 'Fresh ingredients and flavour in every bite.', image: '/gallery/unnamed (2).webp' },
  { title: 'Dine In or Pick Up', description: 'Enjoy your favourites your way.', image: '/gallery/unnamed (3).webp' },
  { title: 'Made for Every Craving', description: 'From everyday meals to satisfying treats.', image: '/gallery/unnamed (5).webp' },
]

export default function Services() {
  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: .3 }} className="mx-auto w-full max-w-md py-6">
      <header className="mb-5">
        <div className="section-title-accent mb-2"><h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Why You’ll Love Mango</h2></div>
        <p className="text-sm text-white/70 sm:text-base">Fresh flavours, good food and happy moments.</p>
      </header>
      <div className="space-y-3">
        {reasons.map(({ title, description, image }, index) => (
          <motion.article key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05, duration: .28 }} className="relative min-h-[112px] overflow-hidden rounded-[23px] border border-[#D9AD49]/30 bg-[#FFFDF7] shadow-[0_12px_28px_rgba(0,0,0,.18)]">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] overflow-hidden"><Image src={image} alt="" fill sizes="260px" className="object-cover object-center opacity-85" aria-hidden /><div className="absolute inset-0 bg-[linear-gradient(90deg,#FFFDF7_0%,rgba(255,250,240,.94)_18%,rgba(255,250,240,.55)_56%,rgba(255,250,240,.08)_100%)]" /></div>
            <span className="absolute right-4 top-3 text-[10px] font-black tracking-[.18em] text-[#276044]">0{index + 1}</span>
            <div className="relative z-10 flex min-h-[112px] items-center gap-3 p-4"><span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#184D3B]/20 bg-white shadow-[0_7px_16px_rgba(33,89,65,.14)]"><Image src={image} alt="" fill sizes="56px" className="object-cover" aria-hidden /></span><div className="min-w-0 max-w-[70%]"><h3 className="text-[16px] font-extrabold leading-tight text-[#19231d]">{title}</h3><p className="mt-1.5 text-[12px] font-semibold leading-[1.45] text-slate-600">{description}</p></div></div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
