'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Phone, ShoppingBag, Star } from 'lucide-react'
import GoogleGIcon from '../../../components/GoogleGIcon'
import { shopConfig } from '../config'
import { getTelLink, getWhatsAppLink } from '../../../lib/phone'
import { generateVCard, downloadVCard } from '../../../lib/vcard'
import OrderTypeSheet from '../../../components/OrderTypeSheet'

interface ActionsRowProps { onOpenPayments?: () => void }
export interface ActionsRowRef { openWhatsAppSelector: () => void; openInstagramSelector: () => void }

const foodImages = ['/gallery/unnamed.webp', '/gallery/unnamed%20(2).webp', '/gallery/unnamed%20(4).webp']
const menuThumbs = ['/gallery/unnamed%20(1).webp', '/gallery/unnamed%20(3).webp', '/gallery/unnamed%20(5).webp']
const pill = "relative flex h-11 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl transition-all duration-200 active:scale-[.97] touch-manipulation"

const ActionsRow = forwardRef<ActionsRowRef, ActionsRowProps>(({ onOpenPayments }, ref) => {
  const [orderOpen, setOrderOpen] = useState(false)
  const [menuImageIndex, setMenuImageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setMenuImageIndex((index) => (index + 1) % foodImages.length), 4200)
    return () => window.clearInterval(timer)
  }, [])

  useImperativeHandle(ref, () => ({
    openWhatsAppSelector: () => {
      const person = shopConfig.contactPersons[0]
      if (person) window.open(getWhatsAppLink(person.whatsappE164, `Hello ${person.label}, I'd like to know more about Mango.`), '_blank', 'noopener,noreferrer')
    },
    openInstagramSelector: () => {
      if (shopConfig.social.instagram) window.open(shopConfig.social.instagram, '_blank', 'noopener,noreferrer')
    },
  }))

  const saveContact = () => {
    const card = generateVCard({
      name: shopConfig.name,
      organization: shopConfig.name,
      title: shopConfig.tagline,
      phones: shopConfig.contactPersons.map((person) => person.phoneE164.replace(/^91/, '')),
      address: shopConfig.contact.address,
      website: shopConfig.url,
    })
    downloadVCard(card, 'Mango-contact.vcf')
  }

  const person = shopConfig.contactPersons[0]
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopConfig.contact.mapQuery)}`

  return <>
    <div className="w-full space-y-3" data-actions-row onClick={(event) => event.stopPropagation()}>
      {/* Burger Bazaar sizing: compact 44px round primary actions */}
      <div className="grid grid-cols-2 gap-2">
        <a href={person ? getTelLink(person.phoneE164) : `tel:${shopConfig.contact.phones[0]}`} className="relative flex h-11 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#184D3B] px-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(24,77,59,.22),0_4px_8px_rgba(21,21,21,.08),inset_0_1px_0_rgba(255,255,255,.12)] transition duration-200 hover:brightness-[1.03] active:scale-[.97] before:absolute before:inset-x-4 before:top-0 before:h-[38%] before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:content-['']">
          <Phone className="relative z-10 h-4 w-4 shrink-0" /><span className="relative z-10 truncate">Call Now</span>
        </a>
        <button type="button" onClick={() => setOrderOpen(true)} className="relative flex h-11 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#184D3B] px-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(24,77,59,.22),0_4px_8px_rgba(21,21,21,.08),inset_0_1px_0_rgba(255,255,255,.12)] transition duration-200 hover:brightness-[1.03] active:scale-[.97] before:absolute before:inset-x-4 before:top-0 before:h-[38%] before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:content-['']">
          <ShoppingBag className="relative z-10 h-4 w-4 shrink-0" /><span className="relative z-10 truncate">Order Now</span>
        </button>
      </div>

      {/* Same photo-led, animated full-width menu banner; Mango food photography */}
      <Link href="/menu" className="group relative block min-h-[82px] overflow-hidden rounded-[22px] p-[2px] shadow-[0_12px_28px_rgba(21,21,21,.13),0_5px_13px_rgba(30,77,61,.13)] transition active:scale-[.985]">
        <span className="absolute inset-0 rounded-[22px] bg-gradient-to-r from-[#FFFDF7] via-[#a8c8ac] to-[#184D3B]" aria-hidden />
        <span className="relative flex min-h-[78px] items-center overflow-hidden rounded-[20px] bg-[#184D3B] px-3.5 py-2.5">
          <AnimatePresence initial={false} mode="sync">
            <motion.span key={foodImages[menuImageIndex]} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: 'easeInOut' }} aria-hidden>
              <Image src={foodImages[menuImageIndex]} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 480px" priority={menuImageIndex === 0} />
            </motion.span>
          </AnimatePresence>
          <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,22,16,.88)_0%,rgba(18,47,32,.72)_45%,rgba(18,47,32,.30)_100%)]" aria-hidden />
          <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[15px] bg-white shadow-[0_7px_18px_rgba(0,0,0,.24)] ring-1 ring-white/80">
            <Image src="/menu-icon.png" alt="" aria-hidden width={25} height={25} className="h-[25px] w-[25px] object-contain" />
          </span>
          <span className="relative z-10 ml-3 min-w-0 flex-1 text-left">
            <strong className="block truncate text-base font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,.45)]">View Menu</strong>
            <span className="mt-0.5 block truncate text-[10px] font-semibold text-white/85">Mango favourites • dine in or pickup</span>
          </span>
          <span className="relative z-10 ml-2 flex shrink-0 -space-x-2" aria-hidden>
            {menuThumbs.map((src, index) => <motion.span key={src} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/95 bg-white shadow-[0_6px_15px_rgba(0,0,0,.28)]" animate={{ y: index === menuImageIndex ? -3 : 0, scale: index === menuImageIndex ? 1.05 : 1 }} transition={{ duration: .45 }}><Image src={src} alt="" fill className="object-cover" sizes="36px" /></motion.span>)}
          </span>
        </span>
      </Link>

      <div className="grid grid-cols-2 gap-2">
        {shopConfig.social.zomato && <a href={shopConfig.social.zomato} target="_blank" rel="noreferrer" className={`${pill} bg-[#E23744] shadow-[0_8px_18px_rgba(226,55,68,.30),0_3px_8px_rgba(21,21,21,.10)]`}><Image src="/Zomato_Logo_1.png" alt="Zomato" width={104} height={28} className="h-7 w-auto object-contain" /></a>}
        {shopConfig.social.swiggy && <a href={shopConfig.social.swiggy} target="_blank" rel="noreferrer" className={`${pill} border border-white/20 bg-[#FF5D0D] shadow-[0_8px_18px_rgba(255,93,13,.26),0_3px_8px_rgba(21,21,21,.08),inset_0_1px_0_rgba(255,255,255,.14)]`}><span className="pointer-events-none absolute inset-x-4 top-0 h-[36%] rounded-full bg-gradient-to-b from-white/12 to-transparent" aria-hidden /><Image src="/swiggy-symbol.png" alt="Swiggy" width={120} height={35} className="relative z-10 h-[25px] w-auto object-contain brightness-0 invert drop-shadow-[0_1px_2px_rgba(0,0,0,.16)]" /></a>}
      </div>

      {/* Payments + Instagram follow Burger's row order and compact button treatment */}
      <div className="grid grid-cols-2 gap-2">
        {onOpenPayments && <button type="button" onClick={onOpenPayments} className={`${pill} gap-2 border border-white/15 bg-gradient-to-br from-[#1B918C] via-[#0F766E] to-[#075E58] px-2 text-white shadow-[0_9px_22px_rgba(15,118,110,.30),0_3px_8px_rgba(21,21,21,.08),inset_0_1px_0_rgba(255,255,255,.14)]`}><span className="pointer-events-none absolute inset-x-4 top-0 h-[36%] rounded-full bg-gradient-to-b from-white/12 to-transparent" aria-hidden /><Image src="/icons8-bhim-48.png" alt="" width={20} height={20} className="relative z-10 h-5 w-5 shrink-0 object-contain brightness-0 invert" /><span className="relative z-10 truncate text-sm font-bold">Payment</span></button>}
        {shopConfig.social.instagram && <a href={shopConfig.social.instagram} target="_blank" rel="noreferrer" className={`${pill} gap-2 border border-[#F1D7E3] bg-[linear-gradient(115deg,#FFFFFF_0%,#FFF9FC_58%,#FCEBF4_100%)] px-2 shadow-[0_8px_18px_rgba(225,48,108,.14),0_4px_9px_rgba(98,40,215,.07),inset_0_1px_0_rgba(255,255,255,.95)]`}><span className="pointer-events-none absolute -right-5 -top-6 h-16 w-20 rounded-full bg-[#E1306C]/15 blur-xl" aria-hidden /><span className="pointer-events-none absolute -bottom-7 left-4 h-14 w-20 rounded-full bg-[#833AB4]/10 blur-xl" aria-hidden /><Image src="/instagram-official.png" alt="Instagram" width={22} height={22} className="relative z-10 h-[21px] w-[21px] shrink-0 object-contain" /><span className="relative z-10 truncate bg-[linear-gradient(90deg,#F58529_0%,#DD2A7B_48%,#8134AF_100%)] bg-clip-text py-0.5 text-sm font-extrabold text-transparent">Instagram</span></a>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/reviews"
          className="relative flex h-11 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/80 px-2 transition-all active:scale-[0.97] touch-manipulation hover:brightness-[1.02]"
          style={{
            background: 'linear-gradient(112deg, #AECBFA 0%, #C6DAFC 22%, #F6AEA6 43%, #FDE293 68%, #A8DAB5 100%)',
            boxShadow: '0 8px 18px rgba(66,133,244,0.20), 0 4px 10px rgba(234,67,53,0.14), inset 0 1px 0 rgba(255,255,255,0.72)',
            transform: 'translateY(-1px)',
          }}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.42),transparent_47%),linear-gradient(180deg,rgba(255,255,255,.20),transparent_52%)]" aria-hidden />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-around px-2 opacity-[.28]" aria-hidden>
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-6 w-6 shrink-0 fill-[#FBBC05] text-[#F4A900]" strokeWidth={1.5} />)}
          </span>
          <GoogleGIcon className="relative z-10 h-[18px] w-[18px] shrink-0" />
          <span className="relative z-10 text-sm font-bold text-[#151515]">Reviews</span>
        </Link>
        <a href={mapUrl} target="_blank" rel="noreferrer" className={`${pill} w-full gap-2 border border-white/80 bg-[linear-gradient(115deg,#EAF1E9_0%,#DDEBDF_48%,#CBE1D0_100%)] px-2 shadow-[0_8px_18px_rgba(52,168,83,.16),0_4px_9px_rgba(21,21,21,.07),inset_0_1px_0_rgba(255,255,255,.82)]`}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[.14]" viewBox="0 0 180 44" preserveAspectRatio="none" aria-hidden><path d="M-8 34C22 12 42 15 66 28s43 10 62-3 36-14 60-7" fill="none" stroke="#34A853" strokeWidth="2.1"/><path d="M19-5c8 15 8 28-1 50M92-4c-8 15-5 29 11 49M151-4c-5 12-3 25 8 49" fill="none" stroke="#4285F4" strokeWidth="1.5" strokeDasharray="4 4"/><path d="M-5 11c30 7 53 5 76-5s45-6 63 5 35 11 53 2" fill="none" stroke="#FBBC05" strokeWidth="1.6"/></svg>
          <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center" aria-hidden><svg viewBox="0 0 24 24" className="h-[21px] w-[21px]"><path d="m2.8 6.1 5.1-2.4v15.9L2.8 22V6.1Z" fill="#34A853"/><path d="m7.9 3.7 6 2.1v15.9l-6-2.1V3.7Z" fill="#FBBC05"/><path d="m13.9 5.8 7.3-2.7V19l-7.3 2.7V5.8Z" fill="#4285F4"/><path d="M16.6 2.2a4.3 4.3 0 0 0-4.3 4.3c0 3.2 4.3 7.8 4.3 7.8s4.3-4.6 4.3-7.8a4.3 4.3 0 0 0-4.3-4.3Z" fill="#EA4335"/><circle cx="16.6" cy="6.5" r="1.65" fill="white"/></svg></span>
          <span className="relative z-10 truncate text-sm font-bold text-[#184D3B]">Location</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={saveContact} className="relative flex h-11 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-[#184D3B] bg-[#EAF1E9] px-2 text-[#184D3B] shadow-[0_8px_18px_rgba(24,77,59,.14),0_4px_8px_rgba(21,21,21,.08),inset_0_1px_0_rgba(255,255,255,.85)] transition active:scale-[.97]">
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#184D3B]/[.10] to-transparent animate-[shimmer_2s_infinite]" />
          <span className="relative z-10 flex items-center justify-center gap-2"><Download className="h-4 w-4 shrink-0" /><span className="truncate text-sm font-bold">Save Contact</span></span>
        </button>
        <Link href="/gallery" onClick={() => sessionStorage.setItem('fromGallery', 'true')} className="relative flex h-11 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-[#184D3B] bg-[#EAF1E9] px-2 text-[#184D3B] shadow-[0_8px_18px_rgba(24,77,59,.14),0_4px_8px_rgba(21,21,21,.08),inset_0_1px_0_rgba(255,255,255,.85)] transition active:scale-[.97]">
          <span className="relative z-10 flex shrink-0 items-center -space-x-1.5" aria-hidden>
            <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#7A9D55] bg-white shadow-sm"><Image src="/gallery/unnamed%20(2).webp" alt="" fill className="object-cover" sizes="28px" /></span>
            <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#7A9D55] bg-white shadow-sm"><Image src="/gallery/unnamed%20(4).webp" alt="" fill className="object-cover" sizes="28px" /></span>
          </span>
          <span className="relative z-10 truncate text-sm font-bold">Gallery</span>
        </Link>
      </div>
    </div>
    <OrderTypeSheet open={orderOpen} onClose={() => setOrderOpen(false)} options={['dine-in', 'takeaway']} />
  </>
})

ActionsRow.displayName = 'ActionsRow'
export default ActionsRow
