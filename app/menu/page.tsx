'use client'

import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Moon, Sun, ShoppingCart, ShoppingBag, Plus, Minus, Check, List, X, ChevronDown, ChevronUp, FileText, ArrowUpRight, Search } from 'lucide-react'
import { menuCategories, type CartItem, type MenuItem } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'
import OrderTypeSheet from '../components/OrderTypeSheet'
import {
  MANGO_CART_KEY,
  MANGO_HANDOFF_TO_MENU,
  MANGO_CHECKOUT_SESSION,
  writeHandoffToCheckout,
  writeOrderType,
  type MangoOrderType,
} from '../lib/cart-session'

type MenuCategoryKey = keyof typeof menuCategories

const categoryKeys: MenuCategoryKey[] = [
  'pizza',
  'bestSellersCombos',
  'burgers',
  'sandwiches',
  'healthySandwiches',
  'momos',
  'mojitos',
  'healthyRefreshers',
  'pasta',
  'maggi',
  'fries',
  'smoothies',
  'shakes',
  'wraps',
  'springRolls',
  'appetizers',
  'soups',
  'gravy',
  'mainCourse',
  'indianCombos',
  'riceNoodles',
  'thali',
  'hotBeverages',
  'iceCream',
]

const defaultOrderMessage = "Hi Mango, I'd like to order from the menu. Please share today's availability and rates."

/** Document scroll — same pattern as /reviews (no nested 100dvh scroller; avoids mobile “half cut” viewport). */
function scrollElementTopOnPage(element: HTMLElement, paddingTop = 8, behavior: ScrollBehavior = 'auto') {
  const eRect = element.getBoundingClientRect()
  const y = window.scrollY + eRect.top - paddingTop
  const top = Math.max(0, y)
  if (!Number.isFinite(top)) return
  window.scrollTo({ top, behavior })
}

function MenuPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const catParam = searchParams.get('cat') as MenuCategoryKey | null
  const mode = searchParams.get('mode')
  const typeParam = searchParams.get('type')
  const isOrderMode = mode === 'order'
  const orderType: MangoOrderType =
    typeParam === 'dine-in' || typeParam === 'takeaway' ? typeParam : 'takeaway'
  const orderTitle =
    orderType === 'dine-in' ? 'Dine In Order' : 'Pickup Order'
  const initialCat = (catParam && categoryKeys.includes(catParam)) ? catParam : 'pizza'
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>(initialCat)
  const [isLightMode, setIsLightMode] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null)
  const [cartBarPulse, setCartBarPulse] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showOrderTypeMenu, setShowOrderTypeMenu] = useState(false)
  const [expandedOrderCategory, setExpandedOrderCategory] = useState<MenuCategoryKey | null>(initialCat)
  const [activeFilter, setActiveFilter] = useState<'all' | 'under150' | 'under300' | 'quickBites' | 'meals' | 'drinks' | 'desserts' | 'combos'>('all')
  const categoryRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const categoryScrollerRef = useRef<HTMLDivElement | null>(null)
  const orderSectionRefs = useRef<Partial<Record<MenuCategoryKey, HTMLElement | null>>>({})
  /** Accordion header row — scroll target so the category title bar lands under the header, not the section bottom. */
  const orderHeaderRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const pendingOrderCategoryJump = useRef<MenuCategoryKey | null>(null)
  /** Only scroll order-mode category pills after first paint (skip land / enter). */
  const skipInitialOrderCategoryPillScroll = useRef(true)
  /** Scroll after filter change only, not on first load. */
  const prevOrderActiveFilter = useRef<string | null>(null)

  useEffect(() => {
    if (catParam && categoryKeys.includes(catParam)) {
      setActiveCategory(catParam)
      setExpandedOrderCategory(catParam)
    }
  }, [catParam])

  useEffect(() => {
    if (isOrderMode) setIsLightMode(true)
  }, [isOrderMode])

  useEffect(() => {
    if (!isOrderMode) return
    writeOrderType(orderType)
  }, [isOrderMode, orderType])

  // Restore cart only after checkout → “Add more items” (one-shot handoff). Refresh / first visit = empty cart.
  useEffect(() => {
    if (!isOrderMode || typeof window === 'undefined') return
    const fromCheckout = window.sessionStorage.getItem(MANGO_HANDOFF_TO_MENU) === '1'
    window.sessionStorage.removeItem(MANGO_HANDOFF_TO_MENU)
    if (!fromCheckout) {
      setCart([])
      window.sessionStorage.removeItem(MANGO_CART_KEY)
      window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
      return
    }
    const raw = window.sessionStorage.getItem(MANGO_CART_KEY)
    if (!raw) {
      setCart([])
      window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
      return
    }
    try {
      const parsed = JSON.parse(raw) as CartItem[]
      setCart(Array.isArray(parsed) ? parsed : [])
    } catch {
      setCart([])
    }
    window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
  }, [isOrderMode])

  useEffect(() => {
    const el = categoryRefs.current[activeCategory]
    const scroller = categoryScrollerRef.current
    if (!el) return
    if (skipInitialOrderCategoryPillScroll.current) {
      skipInitialOrderCategoryPillScroll.current = false
      return
    }
    if (scroller) {
      scroller.scrollTo({ left: Math.max(0, el.offsetLeft - 12), behavior: 'smooth' })
      return
    }
    el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [activeCategory])

  const currentCategory = menuCategories[activeCategory]
  const browseItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return currentCategory.items
    return currentCategory.items.filter((item) =>
      [item.name, item.description, item.quantity].filter(Boolean).join(' ').toLowerCase().includes(query)
    )
  }, [currentCategory.items, searchQuery])
  const currentItemCount = browseItems.length

  const openWhatsApp = () => {
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    window.open(getWhatsAppLink(e164, defaultOrderMessage), '_blank')
  }

  const addToCart = (menuItem: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id)
      if (existing) return prev.map((item) => item.id === menuItem.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item)
      return [...prev, { ...menuItem, cartQuantity: 1 }]
    })
    setLastAddedItemId(menuItem.id)
    setCartBarPulse(true)
    window.setTimeout(() => setLastAddedItemId(null), 550)
    window.setTimeout(() => setCartBarPulse(false), 320)
  }

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId))
      return
    }
    setCart((prev) => prev.map((item) => item.id === itemId ? { ...item, cartQuantity: qty } : item))
    setCartBarPulse(true)
    window.setTimeout(() => setCartBarPulse(false), 320)
  }

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.cartQuantity, 0)
  const getItemNumericPrice = (price: string) => {
    const numeric = parseFloat(price.replace('₹', '').replace(',', '').split('/')[0].trim())
    return isNaN(numeric) ? 0 : numeric
  }
  const getTotalPrice = () =>
    cart.reduce((sum, item) => {
      const numeric = getItemNumericPrice(item.price)
      return sum + numeric * item.cartQuantity
    }, 0)

  const filteredOrderCategories = useMemo(() => {
    return categoryKeys
      .map((key) => {
        const cat = menuCategories[key]
        const items = cat.items.filter((item) => {
          const query = searchQuery.trim().toLowerCase()
          if (query && ![item.name, item.description, item.quantity].filter(Boolean).join(' ').toLowerCase().includes(query)) return false
          const price = getItemNumericPrice(item.price)
          if (activeFilter === 'all') return true
          if (activeFilter === 'under150') return price > 0 && price <= 150
          if (activeFilter === 'under300') return price > 0 && price <= 300
          if (activeFilter === 'quickBites') return ['pizza', 'burgers', 'sandwiches', 'healthySandwiches', 'momos', 'pasta', 'maggi', 'fries', 'wraps', 'springRolls', 'appetizers'].includes(key)
          if (activeFilter === 'meals') return ['gravy', 'mainCourse', 'indianCombos', 'riceNoodles', 'thali'].includes(key)
          if (activeFilter === 'drinks') return ['mojitos', 'healthyRefreshers', 'smoothies', 'shakes', 'hotBeverages'].includes(key)
          if (activeFilter === 'desserts') return ['iceCream'].includes(key)
          if (activeFilter === 'combos') return ['bestSellersCombos', 'indianCombos'].includes(key)
          return true
        })
        return { key, cat, items }
      })
      .filter((entry) => entry.items.length > 0)
  }, [activeFilter, searchQuery])

  const scrollToCategorySection = (key: MenuCategoryKey) => {
    const header = orderHeaderRefs.current[key]
    const section = orderSectionRefs.current[key]
    const target = header ?? section
    if (target) {
      scrollElementTopOnPage(target, 8, 'auto')
      return
    }
    section?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  /** After accordion opens (~200ms transition), snap scroll to category header (instant, not smooth). */
  const scheduleScrollToOrderSection = (key: MenuCategoryKey) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToCategorySection(key), 200)
    })
  }

  useEffect(() => {
    if (!isOrderMode) return
    const pending = pendingOrderCategoryJump.current
    if (pending) {
      pendingOrderCategoryJump.current = null
      setActiveCategory(pending)
      setExpandedOrderCategory(pending)
      window.setTimeout(() => scrollToCategorySection(pending), 200)
      return
    }
    const first = filteredOrderCategories[0]
    if (!first) {
      setExpandedOrderCategory(null)
      prevOrderActiveFilter.current = activeFilter
      return
    }
    setExpandedOrderCategory(first.key)
    setActiveCategory(first.key)
    const filterChanged =
      prevOrderActiveFilter.current !== null && prevOrderActiveFilter.current !== activeFilter
    prevOrderActiveFilter.current = activeFilter
    if (filterChanged) {
      window.setTimeout(() => scrollToCategorySection(first.key), 200)
    }
  }, [activeFilter, isOrderMode, filteredOrderCategories])

  const goToCheckout = () => {
    writeHandoffToCheckout(cart, orderType)
    router.push('/checkout')
  }

  const jumpToOrderCategory = (key: MenuCategoryKey) => {
    const hasSection = filteredOrderCategories.some((e) => e.key === key)
    if (!hasSection) {
      pendingOrderCategoryJump.current = key
      setActiveFilter('all')
      return
    }
    setActiveCategory(key)
    setExpandedOrderCategory(key)
    scheduleScrollToOrderSection(key)
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden">
      <main
        className={`relative min-h-screen ${isOrderMode ? (cart.length > 0 ? 'pb-[calc(9rem+env(safe-area-inset-bottom))]' : 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]') : 'pb-24'} transition-colors duration-300 w-full max-w-full pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))] ${
          isLightMode
            ? 'bg-gradient-to-b from-[#fff8e8] via-slate-50 to-[#fef2d7] text-slate-900'
            : 'bg-gradient-to-b from-slate-950 via-[#08110f] to-slate-950 text-white'
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -top-14 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${isLightMode ? 'bg-[#FBEC89]/20' : 'bg-[#FBEC89]/10'}`} />
          <div className={`absolute top-[22rem] -left-20 h-64 w-64 rounded-full blur-3xl ${isLightMode ? 'bg-mango-green/12' : 'bg-mango-green/16'}`} />
          <div className={`absolute bottom-[18rem] right-[-5rem] h-72 w-72 rounded-full blur-3xl ${isLightMode ? 'bg-[#FBEC89]/15' : 'bg-white/[0.05]'}`} />
        </div>

        <div
          className={`relative z-20 transition-colors duration-300 ${isLightMode ? 'bg-[#fff8e8]' : 'bg-slate-950'}`}
          style={{
            paddingTop: 'max(0.4rem, env(safe-area-inset-top))',
          }}
        >
          <div className={`w-full max-w-md mx-auto px-2 sm:px-3 ${isOrderMode ? 'pb-2' : 'pb-3'}`}>
            <div
              className={`rounded-[28px] px-2.5 sm:px-3 py-3 border transition-colors duration-300 ${
                isLightMode ? 'border-amber-200/70 bg-white shadow-sm' : 'border-white/[0.08] bg-white/[0.06] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between relative">
                <Link
                  href="/"
                  aria-label="Back to Mango"
                  className={`z-10 inline-flex h-11 w-11 items-center justify-center rounded-[15px] border shadow-[0_5px_14px_rgba(24,77,59,.12)] transition active:scale-95 ${
                    isLightMode ? 'border-[#D9AD49]/40 bg-[#184D3B] hover:bg-[#7A9D55]' : 'border-white/15 bg-white/10 hover:bg-white/15'
                  }`}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('fromMenu', 'true')
                    }
                  }}
                >
                  <ArrowLeft className="h-5 w-5 text-white" strokeWidth={2.5} />
                </Link>
                <h1
                  className={`absolute left-0 right-0 text-center pointer-events-none px-12 ${
                    isLightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {isOrderMode ? (
                    <span className="text-lg sm:text-xl font-bold tracking-tight leading-tight">{orderTitle}</span>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold tracking-tight">Our Menu</span>
                  )}
                </h1>
                {isOrderMode ? (
                  <div className="z-10 h-8 w-8 shrink-0" aria-hidden />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsLightMode((v) => !v)}
                    className="flex items-center text-xs sm:text-sm font-semibold z-10 touch-manipulation"
                  >
                    <span
                      className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full border transition-colors ${
                        isLightMode
                          ? 'bg-slate-100 border-slate-300 shadow-[0_4px_10px_rgba(148,163,184,0.55)]'
                          : 'bg-slate-800 border-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.8)]'
                      }`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex w-1/2 items-center justify-center text-[11px] sm:text-xs ${
                          isLightMode ? 'text-amber-500' : 'text-slate-400'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                      </span>
                      <span
                        className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-[11px] sm:text-xs ${
                          !isLightMode ? 'text-slate-100' : 'text-slate-400'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                      </span>
                      <span
                        className={`inline-block h-6 w-6 sm:h-7 sm:w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                          isLightMode ? 'translate-x-[26px] sm:translate-x-[30px]' : 'translate-x-1'
                        }`}
                      />
                    </span>
                  </button>
                )}
              </div>

              <div className="mt-3">
                {!isOrderMode && (
                <a href="/mango%20menu%2018-04-2026.pdf" target="_blank" rel="noopener noreferrer" className={`group mb-3 flex min-h-[62px] w-full items-center justify-between gap-3 overflow-hidden rounded-[19px] border px-3.5 transition-all ${isLightMode ? 'border-[#D9AD49]/45 bg-[#FFFDF7] text-slate-900 shadow-[0_8px_20px_rgba(24,77,59,.08)] hover:border-[#184D3B]/45' : 'border-white/10 bg-white/[.07] text-white shadow-[0_12px_28px_rgba(0,0,0,.25)] hover:bg-white/[.1]'}`}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#184D3B] text-white shadow-[0_7px_15px_rgba(24,77,59,.2)]"><FileText className="h-[18px] w-[18px]" strokeWidth={2.4} /></span>
                    <span className="min-w-0 flex-1 text-left"><span className="block text-[13px] font-extrabold">View PDF Menu</span><span className={`mt-0.5 block text-[10px] font-semibold ${isLightMode ? 'text-slate-500' : 'text-white/65'}`}>Full menu · opens in a new tab</span></span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isLightMode ? 'bg-[#EAF1E9] text-[#184D3B]' : 'bg-white/10 text-white'}`}><ArrowUpRight className="h-4 w-4" /></span>
                  </a>
                )}
                {isOrderMode && (
                  <button
                    type="button"
                    onClick={() => setShowOrderTypeMenu(true)}
                    className="mb-3 flex w-full items-center justify-between rounded-2xl border border-[#E9DDAF] bg-white px-3.5 py-3 text-left shadow-[0_10px_22px_rgba(30,77,61,0.08)] transition-all hover:border-[#1E4D3D]/35 active:scale-[0.99]"
                  >
                    <span>
                      <span className="block text-[11px] font-extrabold uppercase tracking-wide text-[#1E4D3D]">Order Mode</span>
                      <span className="mt-0.5 block text-sm font-bold text-slate-900">
                        {orderType === 'dine-in' ? 'Dine In' : 'Pickup'}
                      </span>
                    </span>
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  </button>
                )}
                {!isOrderMode && (
                <div>
                <label className="mb-2.5 flex h-11 items-center gap-3 rounded-2xl border border-[#D9AD49]/30 bg-white px-3.5 shadow-[0_6px_16px_rgba(24,77,59,.06)] focus-within:border-[#184D3B]/45 focus-within:ring-4 focus-within:ring-[#184D3B]/[.07]">
                  <Search className="h-[18px] w-[18px] shrink-0 text-[#184D3B]" strokeWidth={2.3} />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`Search ${currentCategory.name.toLowerCase()}...`} className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400" aria-label="Search menu items" />
                  {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF1E9] text-[#184D3B]" aria-label="Clear menu search"><X className="h-3.5 w-3.5" /></button>}
                </label>
                <p className="mb-1 px-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">Categories</p>
                <div ref={categoryScrollerRef} className="flex min-w-0 gap-2.5 overflow-x-auto scrollbar-hide py-1 pl-0.5 pr-6" style={{ WebkitMaskImage: 'linear-gradient(to right,#000 0%,#000 calc(100% - 28px),transparent 100%)', maskImage: 'linear-gradient(to right,#000 0%,#000 calc(100% - 28px),transparent 100%)' }}>
                  {categoryKeys.map((key) => {
                    const cat = menuCategories[key]
                    const isActive = activeCategory === key
                    return (
                      <motion.button
                        key={key}
                        ref={(el) => { categoryRefs.current[key] = el }}
                        onClick={() => setActiveCategory(key)}
                        whileTap={{ scale: 0.97 }}
                        className={`relative flex h-11 shrink-0 items-center gap-2 rounded-[15px] border px-2 pr-3 text-left text-[12px] font-extrabold shadow-sm transition ${
                          isActive
                            ? 'border-[#184D3B] bg-[#184D3B] text-white shadow-[0_8px_18px_rgba(24,77,59,.2)]'
                            : 'border-[#D9AD49]/35 bg-[#FFFDF7] text-slate-700 hover:border-[#184D3B]/45 hover:bg-[#EAF1E9]'
                        }`}
                      >
                        <span className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-[11px] ${isActive ? 'ring-1 ring-white/35' : 'ring-1 ring-[#D9AD49]/45'}`}><Image src={cat.image} alt="" fill className="object-cover" sizes="32px" unoptimized /></span>
                        <span className="whitespace-nowrap">{cat.name}</span>
                      </motion.button>
                    )
                  })}
                </div>
                </div>
                )}
                {isOrderMode && (
                  <>
                    <label className="mb-2.5 mt-2 flex h-11 items-center gap-3 rounded-2xl border border-[#D9AD49]/30 bg-white px-3.5 shadow-[0_6px_16px_rgba(24,77,59,.06)] focus-within:border-[#184D3B]/45 focus-within:ring-4 focus-within:ring-[#184D3B]/[.07]">
                      <Search className="h-[18px] w-[18px] shrink-0 text-[#184D3B]" strokeWidth={2.3} />
                      <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search the full menu..." className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400" aria-label="Search the full menu" />
                      {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF1E9] text-[#184D3B]" aria-label="Clear menu search"><X className="h-3.5 w-3.5" /></button>}
                    </label>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pt-0.5 -mx-0.5 px-0.5">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'under150', label: 'Under ₹150' },
                        { id: 'under300', label: 'Under ₹300' },
                        { id: 'quickBites', label: 'Quick Bites' },
                        { id: 'meals', label: 'Meals' },
                        { id: 'drinks', label: 'Drinks' },
                        { id: 'desserts', label: 'Desserts' },
                        { id: 'combos', label: 'Combos' },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                          className={`h-9 shrink-0 px-3.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors touch-manipulation ${
                            activeFilter === filter.id
                              ? 'bg-mango-green text-white border-mango-green shadow-[0_8px_18px_rgba(30,77,61,0.22)]'
                              : isLightMode
                                ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white'
                                : 'bg-white/[0.08] text-white/90 border-white/[0.15] hover:bg-white/[0.12]'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                    <div ref={categoryScrollerRef} className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5 -mx-0.5 px-0.5 scroll-px-3">
                      {categoryKeys.map((key) => {
                        const cat = menuCategories[key]
                        const isActive = activeCategory === key
                        return (
                          <motion.button
                            key={`order-cat-${key}`}
                            ref={(el) => { categoryRefs.current[key] = el }}
                            type="button"
                            onClick={() => jumpToOrderCategory(key)}
                            whileTap={{ scale: 0.97 }}
                            className={`flex h-11 items-center gap-2 rounded-[15px] border px-2 pr-3 text-[12px] font-extrabold whitespace-nowrap shrink-0 transition-all ${
                              isActive
                                ? 'bg-[#184D3B] text-white border-[#184D3B] shadow-[0_8px_18px_rgba(24,77,59,.22)]'
                                : 'bg-[#FFFDF7] text-slate-800 border-[#D9AD49]/35 shadow-[0_4px_14px_rgba(15,23,42,.08)] hover:border-[#184D3B]/45 hover:bg-[#EAF1E9]'
                            }`}
                          >
                            <span className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-[11px] ${isActive ? 'ring-1 ring-white/35' : 'ring-1 ring-[#D9AD49]/45'}`}><Image src={cat.image} alt="" fill className="object-cover" sizes="32px" unoptimized /></span>
                            <span className="leading-tight">{cat.name}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {!isOrderMode && (
            <div className="w-full max-w-md mx-auto px-2 sm:px-3 pt-4 pb-1">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0.96 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="relative min-h-[110px] overflow-hidden rounded-[24px] border border-white/20 bg-slate-900 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,.16)]"
              >
                <Image src={currentCategory.image} alt="" fill className="object-cover opacity-75" sizes="430px" unoptimized />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,22,16,.92)_0%,rgba(18,47,32,.72)_58%,rgba(18,47,32,.22)_100%)]" />
                <div className="relative z-10 min-w-0 pr-12">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/70">Menu category</p>
                  <h2 className="mt-1 break-words text-[23px] font-black leading-tight tracking-tight text-white sm:text-[25px]">{currentCategory.name}</h2>
                  <p className="mt-1 text-[12px] font-semibold text-white/80">{currentItemCount} {currentItemCount === 1 ? 'item' : 'items'} · made to order</p>
                </div>
                <span className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-white/15 text-[11px] font-black text-white backdrop-blur-md">{currentItemCount}</span>
              </motion.div>
            </div>
          )}

          <div className="w-full max-w-md mx-auto px-2 sm:px-3 pt-3 pb-8">
            {isOrderMode ? (
              <div className="space-y-2.5">
                {filteredOrderCategories.length === 0 ? (
                  <div
                    className={`rounded-2xl border border-dashed px-4 py-8 text-center text-sm font-medium ${
                      isLightMode ? 'border-slate-300 bg-white text-slate-500' : 'border-white/20 bg-white/[0.06] text-white/65'
                    }`}
                  >
                    No items found in this filter.
                  </div>
                ) : filteredOrderCategories.map(({ key, cat, items: filteredItems }) => {
                  const isOpen = expandedOrderCategory === key
                  return (
                    <section
                      ref={(el) => { orderSectionRefs.current[key] = el }}
                      key={`order-section-${key}`}
                      className={`w-full overflow-hidden rounded-[28px] border transition-all duration-200 ${
                        isLightMode
                          ? isOpen
                            ? 'border-mango-green/25 bg-white shadow-[0_16px_36px_rgba(30,77,61,0.12)] ring-1 ring-mango-green/15'
                            : 'border-slate-200/95 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:border-slate-300'
                          : isOpen
                            ? 'border-white/20 bg-white/[0.08] shadow-lg ring-1 ring-white/10'
                            : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.08]'
                      }`}
                    >
                      <button
                        ref={(el) => {
                          orderHeaderRefs.current[key] = el
                        }}
                        type="button"
                        onClick={() => {
                          if (isOpen) {
                            setExpandedOrderCategory(null)
                            return
                          }
                          setExpandedOrderCategory(key)
                          setActiveCategory(key)
                          scheduleScrollToOrderSection(key)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-4 text-left touch-manipulation active:bg-slate-50/80 ${
                          isLightMode ? 'bg-slate-50/70 hover:bg-slate-50' : 'bg-white/[0.04] hover:bg-white/[0.07]'
                        }`}
                      >
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,.14)] ring-1 ring-[#D9AD49]/35">
                          <Image src={cat.image} alt="" fill className="object-cover" sizes="56px" unoptimized />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className={`block break-words text-[16px] font-extrabold leading-tight sm:text-[17px] ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                            {cat.name}
                          </span>
                          <span className={`mt-1 block text-[13px] font-medium ${isLightMode ? 'text-slate-500' : 'text-white/60'}`}>
                            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                            <span className="opacity-40"> · </span>
                            {isOpen ? 'Tap header to close' : 'Tap to view & add'}
                          </span>
                        </div>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isLightMode
                              ? isOpen
                                ? 'bg-mango-green text-white'
                                : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'
                              : isOpen
                                ? 'bg-white/25 text-white'
                                : 'bg-white/10 text-white'
                          }`}
                        >
                          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className={`overflow-hidden border-t ${isLightMode ? 'border-slate-100' : 'border-white/10'}`}
                          >
                            <div className="p-3 space-y-3.5">
                              {filteredItems.map((item, index) => {
                                const inCartQty = cart.find((c) => c.id === item.id)?.cartQuantity || 0
                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.02, 0.15) }}
                                    className="group overflow-hidden rounded-[24px] border transition-all duration-300 relative"
                                    style={
                                      isLightMode
                                        ? {
                                            background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 56%, #fafafa 100%)',
                                            border: '1px solid rgba(226, 232, 240, 0.95)',
                                            boxShadow: '0 12px 26px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
                                          }
                                        : {
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                          }
                                    }
                                  >
                                    <div className="relative z-10 flex min-w-0 gap-3 p-4">
                                      <div className="min-w-0 flex-1 py-1">
                                      <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                          isLightMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-200 border-emerald-400/35'
                                        }`}
                                      >
                                        Veg
                                      </span>
                                      <h3 className={`mt-2 break-words text-[15px] font-extrabold leading-snug ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{item.name}</h3>
                                      <p className={`mt-1 text-[16px] font-black ${isLightMode ? 'text-[#184D3B]' : 'text-white/90'}`}>{item.price}</p>
                                      {item.description && (
                                        <p className={`mt-1 break-words text-xs leading-snug ${isLightMode ? 'text-slate-500' : 'text-white/60'}`}>{item.description}</p>
                                      )}
                                      {item.quantity && item.quantity !== '1 portion' && (
                                        <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-white/55'}`}>{item.quantity}</p>
                                      )}
                                      </div>
                                      <div className="flex w-[88px] shrink-0 flex-col justify-end gap-2 pt-1">
                                        {inCartQty > 0 ? (
                                          <div className={`flex h-9 w-full items-center justify-between rounded-xl px-1 transition-transform ${lastAddedItemId === item.id ? 'scale-[1.03]' : ''}`} style={{ background: '#184D3B', color: '#FFFFFF' }}>
                                            <button type="button" onClick={() => updateCartQuantity(item.id, inCartQty - 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-white">
                                              <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-bold tabular-nums">{inCartQty}</span>
                                            <button type="button" onClick={() => addToCart(item)} className="flex h-7 w-7 items-center justify-center rounded-full text-white">
                                              <Plus className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <motion.button
                                            type="button"
                                            onClick={() => addToCart(item)}
                                            whileTap={{ scale: 0.97 }}
                                            animate={lastAddedItemId === item.id ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                            transition={{ duration: 0.28, ease: 'easeOut' }}
                                            className="relative flex h-9 w-full items-center justify-center gap-1 overflow-hidden rounded-xl border text-[11px] font-extrabold"
                                            style={{
                                              borderColor: '#184D3B',
                                              color: '#184D3B',
                                              background: isLightMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                                            }}
                                          >
                                            {lastAddedItemId === item.id && (
                                              <span className="absolute inset-0 rounded-xl bg-[#215941]/10 animate-ping" />
                                            )}
                                            <span className="relative z-10 inline-flex items-center gap-1">
                                              Add
                                              <Plus className="w-4 h-4" />
                                            </span>
                                          </motion.button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  )
                })}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 gap-2.5"
                >
                  {browseItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.02, 0.15) }}
                      className="group relative flex min-h-[96px] items-center gap-3 overflow-hidden rounded-[22px] border p-4 transition-all duration-300"
                      style={
                        isLightMode
                          ? {
                              background: '#FFFFFF',
                              border: '1px solid #E8E2D2',
                              boxShadow: '0 8px 22px rgba(15,23,42,.065)',
                            }
                          : {
                              background: 'linear-gradient(180deg,rgba(255,255,255,.085),rgba(255,255,255,.04))',
                              border: '1px solid rgba(233,196,106,.18)',
                              boxShadow: '0 14px 34px rgba(0,0,0,.42)',
                            }
                      }
                    >
                      <div className="min-w-0 flex-1 py-1">
                        <h3 className={`break-words text-[14px] font-extrabold leading-snug sm:text-[15px] ${isLightMode ? 'text-slate-900' : 'text-white/95'}`}>{item.name}</h3>
                        {item.description && <p className={`mt-1 break-words text-[11px] font-medium leading-snug ${isLightMode ? 'text-slate-500' : 'text-white/60'}`}>{item.description}</p>}
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5">
                          {item.quantity && item.quantity !== '1 portion' ? <span className={`text-[10px] font-semibold ${isLightMode ? 'text-slate-400' : 'text-white/50'}`}>{item.quantity}</span> : <span className={`text-[9px] font-extrabold uppercase tracking-[.1em] ${isLightMode ? 'text-[#16803C]' : 'text-emerald-300'}`}>Vegetarian</span>}
                          <span className={`shrink-0 rounded-xl border px-2.5 py-1 text-[13px] font-black tabular-nums ${isLightMode ? 'border-[#184D3B]/15 bg-[#EAF1E9] text-[#184D3B]' : 'border-white/15 bg-black/25 text-[#F2D48E]'}`}>{item.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {browseItems.length === 0 && <div className="rounded-[22px] border border-dashed border-[#D9AD49]/35 bg-white px-5 py-10 text-center shadow-sm"><Search className="mx-auto h-6 w-6 text-[#184D3B]" /><p className="mt-3 text-[15px] font-extrabold text-slate-900">No matching dishes</p><p className="mt-1 text-[12px] font-medium text-slate-500">Try another search or choose a different category.</p><button type="button" onClick={() => setSearchQuery('')} className="mt-4 rounded-full bg-[#184D3B] px-4 py-2 text-[12px] font-bold text-white">Clear search</button></div>}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <OrderTypeSheet
        open={isOrderMode && showOrderTypeMenu}
        onClose={() => setShowOrderTypeMenu(false)}
        currentType={orderType}
      />

      <AnimatePresence>
        {showCategoryMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100001] bg-black/35 backdrop-blur-[1px] p-3"
            onClick={() => setShowCategoryMenu(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="mx-auto mt-4 w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_44px_rgba(15,23,42,0.22)] max-h-[72vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">Browse Menu</p>
                <button
                  type="button"
                  onClick={() => setShowCategoryMenu(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden py-1.5 scrollbar-hide touch-pan-y">
                {categoryKeys.map((key) => {
                  const cat = menuCategories[key]
                  const isActive = activeCategory === key
                  return (
                    <button
                      key={`menu-sheet-${key}`}
                      type="button"
                      onClick={() => {
                        setActiveCategory(key)
                        setExpandedOrderCategory(key)
                        setShowCategoryMenu(false)
                        window.setTimeout(() => scrollToCategorySection(key), 200)
                      }}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between border-b border-slate-100/90 last:border-b-0"
                    >
                      <span className={`text-[16px] font-semibold ${isActive ? 'text-[#215941]' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[15px] font-semibold ${isActive ? 'text-[#215941]' : 'text-slate-500'}`}>
                        {cat.items.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
          <AnimatePresence>
            {isOrderMode && cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9999] flex justify-center"
                style={{
                  paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
                }}
              >
                <motion.button
                  onClick={goToCheckout}
                  animate={cartBarPulse ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="pointer-events-auto w-full max-w-[430px] h-[60px] rounded-full text-white shadow-[0_14px_28px_rgba(226,55,68,0.32)] flex items-center justify-between px-4 border border-white/20"
                  style={{ background: '#215941' }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/10"><ShoppingBag className="h-4 w-4" /></span>
                    <span className="text-[16px] font-semibold">{getTotalItems()} items added</span>
                  </span>
                  <span className="text-[16px] font-semibold">Checkout &gt;</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!showCategoryMenu && (
              <div
                className={`pointer-events-none fixed inset-x-0 z-[10000] mx-auto flex w-full max-w-[430px] justify-end ${
                  isOrderMode && cart.length > 0
                    ? 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))]'
                    : 'bottom-[max(0.75rem,env(safe-area-inset-bottom))]'
                }`}
                style={{
                  paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
                }}
              >
                <motion.button
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={() => setShowCategoryMenu(true)}
                  whileTap={{ scale: 0.97 }}
                  className="pointer-events-auto h-11 rounded-full shadow-[0_14px_30px_rgba(15,23,42,0.38)] text-white px-4 inline-flex items-center gap-2.5 border border-white/20 touch-manipulation"
                  style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 inline-flex items-center justify-center">
                    <List className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold tracking-wide">Menu</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>
      </>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen pb-24 flex items-center justify-center"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <p className="text-white/70 text-sm">Loading menu…</p>
        </main>
      }
    >
      <MenuPageInner />
    </Suspense>
  )
}
