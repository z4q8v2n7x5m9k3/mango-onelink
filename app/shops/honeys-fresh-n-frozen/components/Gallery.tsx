'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Gallery images from public/gallery folder (Mango)
const galleryImages = [
  '/gallery/unnamed.webp',
  '/gallery/unnamed (1).webp',
  '/gallery/unnamed (2).webp',
  '/gallery/unnamed (3).webp',
  '/gallery/unnamed (4).webp',
  '/gallery/unnamed (5).webp',
]

const visibleImages = galleryImages.slice(0, 4)

export default function Gallery() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      visibleImages.forEach((src) => {
        const img = document.createElement('img')
        img.src = src
      })
    }
  }, [])

  const handleImageClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromGallery', 'true')
    }
    router.push('/gallery')
  }

  return (
    <section id="gallery" className="w-full max-w-md mx-auto pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-6"
      >
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            A Taste of Mango
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-300/90 font-normal text-left">
          A little glimpse of everything we love serving.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3.5">
        {visibleImages.map((imageSrc, index) => (
          <motion.div
            key={`gallery-${index}-${imageSrc}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className="relative aspect-square rounded-[24px] overflow-hidden shadow-[0_18px_36px_rgba(0,0,0,0.24)] cursor-pointer group border border-white/10"
            onClick={handleImageClick}
          >
            <Image
              src={imageSrc}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 448px) 50vw, 224px"
            />
            <div className="absolute inset-[1px] rounded-[23px] border border-white/10 z-[1]" />
            <div className="absolute inset-x-6 top-4 h-10 rounded-full bg-white/12 blur-2xl z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent group-hover:from-black/60 transition-colors" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5"
      >
        <Link
          href="/gallery"
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('fromGallery', 'true')
            }
          }}
          className="flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl border border-[#D9AD49]/30 bg-[#184D3B] px-4 font-extrabold text-white shadow-[0_12px_24px_rgba(30,77,61,.28)] transition-all hover:bg-[#28624d] hover:shadow-[0_16px_28px_rgba(30,77,61,.34)] active:scale-[.99]"
        >
          <span className="flex shrink-0 -space-x-2" aria-hidden>
            <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#B9D4A7] bg-white shadow-sm"><Image src="/gallery/unnamed%20(2).webp" alt="" fill className="object-cover" sizes="28px" /></span>
            <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#B9D4A7] bg-white shadow-sm"><Image src="/gallery/unnamed%20(4).webp" alt="" fill className="object-cover" sizes="28px" /></span>
          </span>
          <span className="whitespace-nowrap text-base tracking-tight">View Gallery</span>
          <span aria-hidden className="text-xl leading-none">→</span>
        </Link>
      </motion.div>
    </section>
  )
}
