'use client'

import { useState } from 'react'
import { RegistrationForm } from '@/components/features/clients/RegistrationForm'
import Image from 'next/image'

export function RegisterPageClient() {
  const [success, setSuccess] = useState(false)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {!success && (
        <div className="hidden items-center justify-center bg-[var(--brand-yellow)] p-12 lg:flex lg:w-1/2">
          <Image
            src="/logo1.png"
            alt="Qalmar"
            width={280}
            height={280}
            className="h-56 w-56 object-contain"
          />
        </div>
      )}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <RegistrationForm onSuccess={() => setSuccess(true)} />
      </div>
    </div>
  )
}
