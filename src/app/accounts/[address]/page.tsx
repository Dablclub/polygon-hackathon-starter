'use client'

import { Button } from '@/components/ui/button'
import PageWithAppbar from '@/components/layout/page-wrapper'
import { useParams, useRouter } from 'next/navigation'
import AccountData from '@/components/onchain/account-data'
import { Address } from 'viem'
import { baseSepolia } from 'viem/chains'

export default function AccountPage() {
  const router = useRouter()
  const { address } = useParams()

  function handleBackButton() {
    router.push('/accounts')
  }

  return (
    <PageWithAppbar>
      <div className="page gap-y-4">
        <div className="flex w-full flex-col items-center gap-y-4">
          <h2>account</h2>
          <Button onClick={handleBackButton}>back</Button>
        </div>
        <div>
          <AccountData
            address={address as Address}
            chain={baseSepolia}
            chainId={baseSepolia.id}
          />
        </div>
      </div>
    </PageWithAppbar>
  )
}
