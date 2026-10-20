'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { PackageCheck, UtensilsCrossed, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { writeOrderType, type MangoOrderType } from '../lib/cart-session'

type OrderTypeSheetProps = {
  open: boolean
  onClose: () => void
  currentType?: MangoOrderType
  options?: MangoOrderType[]
  onSelect?: (type: MangoOrderType) => void
}

const orderTypes = {
  online: {
    label: 'Online Order',
    detail: 'Browse Mango’s full menu',
    Icon: UtensilsCrossed,
    image: undefined,
    href: '/menu',
  },
  'dine-in': {
    label: 'Dine In',
    detail: 'Enjoy your meal here',
    Icon: UtensilsCrossed,
    image: '/gallery/unnamed%20(5).webp',
    href: '/menu?mode=order&type=dine-in',
  },
  takeaway: {
    label: 'Takeaway',
    detail: 'Order ahead, then pick up',
    Icon: PackageCheck,
    image: '/gallery/unnamed%20(2).webp',
    href: '/menu?mode=order&type=takeaway',
  },
} satisfies Record<MangoOrderType, { label: string; detail: string; Icon: typeof UtensilsCrossed; image?: string; href: string }>

export default function OrderTypeSheet({
  open,
  onClose,
  currentType,
  options = ['dine-in', 'takeaway'],
  onSelect,
}: OrderTypeSheetProps) {
  const router = useRouter()

  const selectOrderType = (type: MangoOrderType) => {
    writeOrderType(type)
    onClose()
    if (onSelect) {
      onSelect(type)
      return
    }
    router.push(orderTypes[type].href)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100050] flex items-end justify-center bg-black/55 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[3px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 430, damping: 34 }}
            className="w-full max-w-[390px] overflow-hidden rounded-[28px] border border-[#d9c98a] bg-[#fffdf7] shadow-[0_28px_70px_rgba(0,0,0,.34)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mango-order-type-title"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#1E4D3D]/10 bg-white px-4 pb-3.5 pt-4">
              <div className="min-w-0 flex-1">
                <p id="mango-order-type-title" className="text-[18px] font-black tracking-tight text-[#173c2c]">How would you like to order?</p>
                <p className="mt-1 text-[12px] font-medium text-slate-500">Enjoy a meal at Mango.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f4ed] text-[#1E4D3D]"
                aria-label="Close order type menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2.5 p-3.5">
              {options.map((type) => {
                const { label, detail, Icon, image } = orderTypes[type]
                const selected = currentType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => selectOrderType(type)}
                    className={`group flex min-h-[76px] w-full min-w-0 items-center gap-3 overflow-hidden rounded-[19px] border p-3 text-left transition active:scale-[.985] ${selected ? 'border-[#1E4D3D] bg-[#1E4D3D] text-white shadow-[0_10px_22px_rgba(30,77,61,.20)]' : 'border-[#1E4D3D]/12 bg-white text-[#173c2c] shadow-[0_7px_18px_rgba(15,23,42,.06)] hover:border-[#1E4D3D]/35'}`}
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[13px] border border-[#1E4D3D]/10 shadow-sm">
                      {image && <Image src={image} alt="" fill className="object-cover" sizes="48px" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold">{label}</span>
                      <span className={`mt-0.5 block text-[11px] font-semibold ${selected ? 'text-white/80' : 'text-slate-500'}`}>
                        {detail}
                      </span>
                    </span>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${selected ? 'bg-white/15 text-[#fdf8e0]' : 'bg-[#fdf8e0] text-[#1E4D3D]'}`}><Icon className="h-[18px] w-[18px]" strokeWidth={2.2} /></span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
