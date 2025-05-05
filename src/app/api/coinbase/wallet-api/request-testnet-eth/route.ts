import { NextRequest, NextResponse } from 'next/server'
import cdp from '@/server/clients/cdp'
import { createPublicClient, http, isAddress } from 'viem'
import { baseSepolia } from 'viem/chains'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    })

    const { transactionHash } = await cdp.evm.requestFaucet({
      address,
      network: 'base-sepolia',
      token: 'eth',
    })
    console.log(transactionHash)

    await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    console.log(
      `Requested funds from ETH faucet: https://sepolia.basescan.org/tx/${transactionHash}`,
    )

    return NextResponse.json({ transactionHash }, { status: 200 })
  } catch (error) {
    console.error('Error requesting testnet ETH:', error)
    return NextResponse.json(
      { error: 'Failed to request testnet ETH' },
      { status: 500 },
    )
  }
}
