'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Address } from 'viem'
import { useMutation } from '@tanstack/react-query'

export default function SendTransactionBtn({ address }: { address: Address }) {
  const { mutate: sendTransaction, isPending: isSendingTransaction } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(
          `/api/coinbase/wallet-api/request-testnet-eth?address=${address}`,
          {
            method: 'POST',
          },
        )
        const data = await response.json()
        console.log(data)
        return data
      },
    })
  return (
    <Button onClick={() => sendTransaction()} disabled={isSendingTransaction}>
      {isSendingTransaction ? 'sending...' : 'send transaction'}
    </Button>
  )
}
