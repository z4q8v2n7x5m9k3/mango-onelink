'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Star } from 'lucide-react'
import { shopConfig } from '../config'

type Review = {
  author_name: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
}
type ReviewsData = {
  rating: number
  totalReviews: number
  reviews: Review[]
  googleUrl?: string
  unavailable?: boolean
  message?: string
}

function Stars({ rating, size = 'h-5 w-5' }: { rating: number; size?: string }) {
  return <span className="flex shrink-0 gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`${size} ${star <= Math.round(rating) ? 'fill-[#DFAE22] text-[#DFAE22]' : 'fill-transparent text-slate-300'}`} strokeWidth={1.9} />)}
  </span>
}

function GoogleMark({ className = 'h-4 w-4' }: { className?: string }) {
  return <svg viewBox="0 0 48 48" className={className} aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"/></svg>
}

export default function GoogleReviews() {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    fetch(`/api/google-reviews?placeId=${encodeURIComponent(shopConfig.google.placeId)}`)
      .then((response) => response.json())
      .then((result) => {
        setData(result)
        setUnavailable(Boolean(result.unavailable || result.error))
      })
      .catch(() => setUnavailable(true))
  }, [])

  return <section id="reviews" className="mx-auto w-full max-w-md pb-6 pt-6">
    <div className="mb-3.5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white shadow-sm"><GoogleMark /></span>
        <h2 className="shrink-0 text-[23px] font-black tracking-tight text-white sm:text-[26px]">Google Reviews</h2>
        <span className="h-px min-w-5 flex-1 bg-gradient-to-r from-[#184D3B] via-[#D9AD49]/65 to-transparent" />
      </div>
      <Link href="/reviews" className="flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-[#D9AD49]/40 bg-white/[.08] px-2.5 text-xs font-extrabold text-white shadow-[0_5px_14px_rgba(0,0,0,.12)] transition hover:bg-white/[.13]">View All <ChevronRight className="h-4 w-4" /></Link>
    </div>

    <div className="space-y-2.5">
      {!data && !unavailable ? <><div className="h-[96px] animate-pulse rounded-[20px] bg-white/90" /><div className="h-[128px] animate-pulse rounded-[20px] bg-white/90" /></> : unavailable || data?.unavailable ? (
        <article className="rounded-[20px] border border-[#184D3B]/15 bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,.08)]">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white shadow-sm"><GoogleMark className="h-5 w-5" /></span>
            <div><h3 className="text-sm font-black text-[#173c2c]">Mango on Google</h3><p className="mt-1 text-[12px] font-medium leading-5 text-slate-500">See current ratings and guest reviews on Mango’s Google profile.</p></div>
          </div>
        </article>
      ) : data ? <>
        <article className="rounded-[20px] border border-[#184D3B]/12 bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,.10)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2"><Stars rating={data.rating} size="h-[18px] w-[18px]" /><strong className="text-xl font-black text-[#173c2c]">{data.rating ? data.rating.toFixed(1) : '—'}</strong></div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9AD49]/70 bg-[#fffdf5] px-2.5 py-1.5 text-xs font-extrabold text-slate-700"><GoogleMark className="h-3.5 w-3.5" />Google</span>
          </div>
          <p className="mt-2 text-[13px] font-medium text-slate-600">Based on {data.totalReviews || 'verified'} reviews on Google</p>
        </article>

        {data.reviews.slice(0, 2).map((review, index) => <article key={`${review.author_name}-${index}`} className="rounded-[20px] border border-[#184D3B]/12 bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,.08)]">
          <div className="flex items-start gap-3">
            {review.profile_photo_url ? <Image src={review.profile_photo_url} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" unoptimized /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#184D3B] text-base font-black text-white">{review.author_name.charAt(0).toUpperCase()}</span>}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><strong className="truncate text-[14px] font-black text-[#173c2c]">{review.author_name}</strong><Stars rating={review.rating} size="h-3.5 w-3.5" /><span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-500"><GoogleMark className="h-3 w-3" />Google</span></div>
              <p className="text-[11px] font-medium text-slate-500">{review.relative_time_description}</p>
            </div>
          </div>
          {review.text && <p className="mt-2.5 line-clamp-3 text-[13px] font-medium leading-5 text-slate-700">{review.text}</p>}
        </article>)}
        {data.reviews.length === 0 && <article className="rounded-[20px] border border-[#184D3B]/12 bg-white p-4 text-center text-sm font-semibold text-slate-500">Guest reviews are available on Mango’s Google profile.</article>}
      </> : null}

      <Link href="/reviews" className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[16px] border border-[#184D3B]/15 bg-white px-5 text-sm font-extrabold text-[#173c2c] shadow-[0_10px_22px_rgba(0,0,0,.12)] transition active:scale-[.985]"><GoogleMark />View All Reviews <ArrowRight className="h-4 w-4" /></Link>
      <a href={shopConfig.google.reviewsUrl} target="_blank" rel="noopener noreferrer" className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#184D3B] px-5 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(30,77,61,.25)] transition active:scale-[.985]"><span className="grid h-6 w-6 place-items-center rounded-full bg-white"><GoogleMark /></span>Write a Review</a>
    </div>
  </section>
}
