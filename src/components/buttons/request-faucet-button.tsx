'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Address } from 'viem'
import { useMutation } from '@tanstack/react-query'

export default function RequestFaucetBtn({ address }: { address: Address }) {
  const { mutate: requestFaucet, isPending: isRequestingFaucet } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/coinbase/accounts/request-testnet-eth?address=${address}`,
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
    <Button onClick={() => requestFaucet()} disabled={isRequestingFaucet}>
      Request Testnet ETH
    </Button>
  )
}
