'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, PackageCheck, UtensilsCrossed } from 'lucide-react'
import { writeOrderType, type MangoOrderType } from '../lib/cart-session'

const orderModes: Array<{
  type: MangoOrderType
  title: string
  description: string
  eyebrow: string
  image: string
  Icon: typeof UtensilsCrossed
}> = [
  { type: 'dine-in', title: 'Dine In', description: 'Choose your favourites and enjoy them at Mango.', eyebrow: 'A table at Mango', image: '/gallery/unnamed%20(1).webp', Icon: UtensilsCrossed },
  { type: 'takeaway', title: 'Pickup', description: 'Order ahead and collect your meal fresh.', eyebrow: 'Ready when you are', image: '/gallery/unnamed%20(4).webp', Icon: PackageCheck },
]

export default function OrderTypePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[470px] px-4 pb-12 pt-[max(1rem,env(safe-area-inset-top))] text-white">
      <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 text-sm font-semibold text-white/90 transition hover:bg-white/[0.12]">
        <ArrowLeft className="h-4 w-4" /> Back to Mango
      </Link>

      <header className="pb-6 pt-8">
        <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-[#FBE9A5]">Mango · Bahu Plaza</p>
        <h1 className="mt-2 text-[36px] font-black leading-[1.02] tracking-[-.04em]">Order Now</h1>
        <p className="mt-3 max-w-[340px] text-[14px] leading-6 text-white/70">Choose how you’d like to enjoy your favourites.</p>
      </header>

      <section className="grid gap-3.5" aria-label="Choose order type">
        {orderModes.map(({ type, title, description, eyebrow, image, Icon }) => (
          <Link key={type} href={`/menu?mode=order&type=${type}`} onClick={() => writeOrderType(type)} className="group relative isolate min-h-[220px] overflow-hidden rounded-[26px] border border-white/20 bg-[#143b2b] shadow-[0_18px_38px_rgba(0,0,0,.25)] transition duration-300 hover:-translate-y-0.5 active:scale-[.99]">
            <Image src={image} alt="" fill sizes="(max-width: 470px) 100vw, 470px" className="absolute inset-0 z-0 object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <span className="absolute inset-0 z-0 bg-gradient-to-t from-[#0d2118]/95 via-[#173c2b]/48 to-black/5" />
            <span className="absolute inset-x-0 bottom-0 z-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-md">{eyebrow}</span>
            <span className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-[23px] font-extrabold leading-tight"><Icon className="h-5 w-5 shrink-0 text-[#FBE9A5]" />{title}</span>
                <span className="mt-1.5 block max-w-[280px] text-[13px] leading-5 text-white/80">{description}</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md transition group-hover:translate-x-0.5"><ArrowRight className="h-5 w-5" /></span>
            </span>
          </Link>
        ))}
      </section>

      <Link href="/menu" className="mt-5 flex min-h-[58px] items-center justify-between rounded-[19px] border border-[#FBE9A5]/40 bg-[#FBE9A5] px-5 text-[#183b2c] shadow-[0_12px_26px_rgba(0,0,0,.18)] transition hover:brightness-105 active:scale-[.99]">
        <span className="text-[15px] font-extrabold">Browse the full menu</span><ArrowRight className="h-5 w-5" />
      </Link>
    </main>
  )
}
