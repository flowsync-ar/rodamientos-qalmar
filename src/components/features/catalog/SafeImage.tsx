'use client'

import { useEffect, useState } from 'react'

const FALLBACK = '/imagen_no_disponible.png'

export function SafeImage({
  src,
  alt,
  className = 'object-cover',
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [src])
  const url = !src || failed ? FALLBACK : src

  return (
    // ponytail: next/image optimizer 400s remote product URLs (Supabase host not allowed / private bucket).
    // Upgrade: keep next/image once remotePatterns + public bucket are guaranteed.
    <img
      src={url}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${className}`}
      onError={() => {
        if (url !== FALLBACK) setFailed(true)
      }}
    />
  )
}
