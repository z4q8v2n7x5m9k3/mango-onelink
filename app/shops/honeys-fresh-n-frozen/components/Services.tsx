'use client'

import { motion } from 'framer-motion'
import { Sparkles, Leaf, ChefHat, Heart } from 'lucide-react'
import Image from 'next/image'

const services = [
  {
    id: 'service-1',
    icon: Sparkles,
    title: 'Clean & Hygienic Kitchen',
    description: 'Freshly prepared food in a well-maintained environment.',
    image: '/gallery/unnamed.webp',
  },
  {
    id: 'service-2',
    icon: Leaf,
    title: 'Pure Vegetarian',
    description: '100% vegetarian menu crafted with quality ingredients.',
    image: '/gallery/unnamed (1).webp',
  },
  {
    id: 'service-3',
    icon: ChefHat,
    title: 'Freshly Prepared Daily',
    description: 'Every dish is prepared fresh in our kitchen.',
    image: '/gallery/unnamed (2).webp',
  },
  {
    id: 'service-4',
    icon: Heart,
    title: 'Healthy & Balanced Meals',
    description: 'Tasteful food made with care and proper preparation standards.',
    image: '/gallery/unnamed (3).webp',
  },
]

export default function Services() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="mb-6">
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Why Mango?
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-300/90 font-normal text-left">
          Clean • Pure Veg • Fresh • Made with Care
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              className="group relative overflow-hidden rounded-[25px] p-5 transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #FBEC89 0%, #FDF8E0 35%, #ffffff 72%, #FEFDF8 100%)',
                border: '1px solid rgba(251, 236, 137, 0.44)',
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.10), 0 4px 14px rgba(30, 77, 61, 0.10)',
              }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[62%] overflow-hidden" aria-hidden>
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="scale-110 object-cover object-center opacity-[0.30] blur-[1.5px] saturate-[0.9]"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/55 to-[#FEFDF8]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-white/38" />
              </div>
              <div className="absolute inset-x-0 top-0 h-20 opacity-65 pointer-events-none bg-gradient-to-b from-white/85 to-transparent" />
              <div className="absolute right-4 top-4 rounded-full border border-[#1E4D3D]/10 bg-white/80 px-2 py-1 text-[9px] font-black tracking-[0.18em] text-[#1E4D3D] shadow-sm">
                  {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10 flex items-start gap-4 transition-all duration-300 group-hover:-translate-y-0.5">
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#FBEC89]/60"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, #FBEC89 100%)',
                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.92)',
                  }}
                >
                  <IconComponent className="w-7 h-7 relative z-10" style={{ color: '#1E4D3D' }} strokeWidth={2} />
                </div>

                <div className="flex-1 relative z-10 pr-7">
                  <h3
                    className="font-bold text-base mb-1.5 leading-tight"
                    style={{ color: '#1e293b' }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#475569' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
