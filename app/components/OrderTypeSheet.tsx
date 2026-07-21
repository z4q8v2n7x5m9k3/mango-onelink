'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Bike, PackageCheck, UtensilsCrossed, X } from 'lucide-react'
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
    label: 'Order Online',
    detail: 'Delivered to your door',
    Icon: Bike,
    href: '/menu?mode=order&type=online',
  },
  'dine-in': {
    label: 'Dine In',
    detail: 'Pre-order before arrival',
    Icon: UtensilsCrossed,
    href: '/menu?mode=order&type=dine-in',
  },
  takeaway: {
    label: 'Takeaway',
    detail: 'Packed for pickup',
    Icon: PackageCheck,
    href: '/menu?mode=order&type=takeaway',
  },
} satisfies Record<MangoOrderType, { label: string; detail: string; Icon: typeof Bike; href: string }>

export default function OrderTypeSheet({
  open,
  onClose,
  currentType,
  options = ['online', 'dine-in', 'takeaway'],
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
          className="fixed inset-0 z-[100050] flex items-end justify-center bg-black/50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 430, damping: 34 }}
            className="w-full max-w-[406px] rounded-[28px] border border-[#E9DDAF] bg-[#FFFDF5] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mango-order-type-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p id="mango-order-type-title" className="text-[18px] font-black tracking-tight text-slate-950">
                  Change Order Type
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-slate-500">How would you like your Mango order?</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9DDAF] bg-white text-[#1E4D3D]"
                aria-label="Close order type menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {options.map((type) => {
                const { label, detail, Icon } = orderTypes[type]
                const selected = currentType === type
                const fullWidth = options.length === 3 && type === 'online'
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => selectOrderType(type)}
                    className={`min-w-0 rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${
                      fullWidth ? 'col-span-2 flex min-h-[78px] items-center gap-3' : 'flex min-h-[108px] flex-col items-start justify-between'
                    } ${
                      selected
                        ? 'border-[#1E4D3D] bg-[#1E4D3D] text-white shadow-[0_12px_26px_rgba(30,77,61,0.24)]'
                        : 'border-[#E9DDAF] bg-white text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)]'
                    }`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected ? 'bg-white/15' : 'bg-[#FBEC89]/40 text-[#1E4D3D]'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={fullWidth ? 'min-w-0 flex-1' : ''}>
                      <span className="block text-[14px] font-extrabold">{label}</span>
                      <span className={`mt-0.5 block text-[10px] font-semibold ${selected ? 'text-white/80' : 'text-slate-500'}`}>
                        {detail}
                      </span>
                    </span>
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
