import PageWithAppbar from '@/components/layout/pageWithAppbar'
import { ConnectedAccount } from '@/components/onchain/connectedAccount'
import React from 'react'

export default function Account() {
  return (
    <PageWithAppbar>
      <div className="page">
        <div className="mb-4">
          <h2>account</h2>
        </div>
        <ConnectedAccount />
      </div>
    </PageWithAppbar>
  )
}
