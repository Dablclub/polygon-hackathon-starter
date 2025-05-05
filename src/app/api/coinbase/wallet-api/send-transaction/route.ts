import { http, createPublicClient, parseEther, isAddress } from 'viem'
import { baseSepolia } from 'viem/chains'
import { NextRequest, NextResponse } from 'next/server'
import cdp from '@/server/clients/cdp'

export async function POST(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams
  const fromAddress = searchParams.get('fromAddress')
  const toAddress = searchParams.get('toAddress')
  const amount = searchParams.get('amount') || '0.000001'

  if (!fromAddress || !isAddress(fromAddress)) {
    return NextResponse.json(
      { error: 'From address is required' },
      { status: 400 },
    )
  }

  if (!toAddress || !isAddress(toAddress)) {
    return NextResponse.json(
      { error: 'To address is required' },
      { status: 400 },
    )
  }

  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    })

    // Step 2: Request ETH from the faucet.
    const { transactionHash: faucetTransactionHash } =
      await cdp.evm.requestFaucet({
        address: fromAddress,
        network: 'base-sepolia',
        token: 'eth',
      })

    // Safety check to ensure the transaction was successful
    await publicClient.waitForTransactionReceipt({
      hash: faucetTransactionHash,
    })

    console.log(
      `Received ETH from faucet: https://sepolia.basescan.org/tx/${faucetTransactionHash}`,
    )

    const { transactionHash } = await cdp.evm.sendTransaction({
      address: fromAddress,
      network: 'base-sepolia',
      transaction: {
        to: toAddress,
        value: parseEther(amount),
      },
    })

    console.log(transactionHash)

    // Step 4: Wait for the transaction to be confirmed
    await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    console.log(
      `Transaction explorer link: https://sepolia.basescan.org/tx/${transactionHash}`,
    )

    return NextResponse.json({ transactionHash }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to send transaction' },
      { status: 500 },
    )
  }
}
