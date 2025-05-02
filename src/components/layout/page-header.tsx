'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PageHeader({ pageTitle }: { pageTitle: string }) {
  const router = useRouter()
  return (
    <div className="relative flex w-full flex-col justify-center px-4">
      <h2>{pageTitle}</h2>
      <button className="l-0 absolute" onClick={() => router.back()}>
        <ChevronLeft className="h-8 w-8" />
      </button>
    </div>
  )
}
