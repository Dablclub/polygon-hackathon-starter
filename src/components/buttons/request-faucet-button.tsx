'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Address } from 'viem'
import { useMutation } from '@tanstack/react-query'

export default function RequestFaucetBtn({
  address,
  onSuccessCallback,
}: {
  address: Address
  onSuccessCallback?: () => Promise<void>
}) {
  const { mutate: requestFaucet, isPending: isRequestingFaucet } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/coinbase/wallet-api/request-testnet-eth?address=${address}`,
        {
          method: 'POST',
        },
      )
      const data = await response.json()
      return data
    },
    onSuccess: async () => {
      await onSuccessCallback?.()
    },
  })
  return (
    <Button
      variant="outline"
      onClick={() => requestFaucet()}
      disabled={isRequestingFaucet}
    >
      Request Testnet ETH
    </Button>
  )
}
