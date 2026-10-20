'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CookingPot, Pizza, Sandwich, UtensilsCrossed } from 'lucide-react'
import Image from 'next/image'
import { menuCategories } from '../menu'

const previewCategories = [
  { key: 'pizza', Icon: Pizza },
  { key: 'burgers', Icon: Sandwich },
  { key: 'momos', Icon: CookingPot },
  { key: 'thali', Icon: UtensilsCrossed },
] as const

export default function MenuPreview() {
  return (
    <section id="menu" className="mx-auto w-full max-w-md py-8">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: .3 }} className="mb-6">
        <div className="section-title-accent mb-3"><h2 className="text-left text-2xl font-bold tracking-tight text-white sm:text-3xl">Something Delicious Awaits</h2></div>
        <p className="text-left text-sm font-medium tracking-tight text-slate-300/90 sm:text-base">Explore your next favourite bite.</p>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3.5">
        {previewCategories.map(({ key, Icon }, index) => {
          const category = menuCategories[key]
          return (
            <Link key={key} href={`/menu?cat=${key}`} className="block">
              <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: index * .05, duration: .35, ease: 'easeOut' }} className="group relative aspect-square cursor-pointer overflow-hidden rounded-[24px] border border-white/10 shadow-[0_16px_32px_rgba(0,0,0,.22)] transition-all duration-300">
                <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 448px) 50vw, 224px" unoptimized />
                <span className="absolute inset-[1px] z-[1] rounded-[23px] border border-white/10" />
                <span className="absolute inset-x-5 top-4 z-[1] h-12 rounded-full bg-white/10 blur-2xl" />
                <span className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,.94)_0%,rgba(0,0,0,.82)_28%,rgba(0,0,0,.54)_55%,rgba(0,0,0,.18)_82%,rgba(0,0,0,.04)_100%)]" />
                <span className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/35 bg-[#184D3B]/85 shadow-lg backdrop-blur-md sm:h-12 sm:w-12">
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden />
                </span>
                <span className="absolute bottom-0 left-0 right-0 z-10 p-3.5 sm:p-4">
                  <span className="mb-0.5 block text-[15px] font-bold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,.85)] sm:text-[17px]">{category.name}</span>
                  <span className="mb-2.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold leading-tight text-slate-200 [text-shadow:0_1px_2px_rgba(0,0,0,.7)] sm:text-[11px]">{category.shortDescription}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur-md transition-colors hover:bg-white/25 sm:text-sm">View Items<ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span>
                </span>
              </motion.article>
            </Link>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .1, duration: .3 }} className="pt-1">
        <Link href="/menu" className="group relative flex min-h-[78px] w-full items-center justify-between overflow-hidden rounded-[22px] border border-white/25 px-5 text-white shadow-[0_15px_30px_rgba(0,0,0,.3)] transition-transform active:scale-[.99]" style={{ backgroundImage: "linear-gradient(90deg,rgba(12,28,20,.96) 0%,rgba(21,59,39,.90) 43%,rgba(30,77,61,.55) 68%,rgba(15,20,16,.18) 100%),url('/gallery/unnamed%20(5).webp')", backgroundSize: 'cover', backgroundPosition: 'center 54%' }}>
          <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.10),transparent_38%,rgba(251,236,137,.12))]" />
          <span className="relative z-10 text-left"><span className="block text-[16px] font-extrabold tracking-tight">View Full Menu</span><span className="mt-0.5 block text-xs font-semibold text-white/75">Browse every dish by category</span></span>
          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md transition-transform duration-200 group-hover:translate-x-0.5"><ArrowRight className="h-5 w-5" /></span>
        </Link>
      </motion.div>
    </section>
  )
}
