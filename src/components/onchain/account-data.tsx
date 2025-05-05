'use client'

import { useBalance, useEnsAvatar, useEnsName } from 'wagmi'
import { mainnet } from 'viem/chains'
import Image from 'next/image'
import { Address, Chain } from 'viem'

export default function AccountData({
  address,
  chain,
  chainId,
}: {
  address: Address
  chain: Chain
  chainId: number
}) {
  const nativeTokenTicker = chain.nativeCurrency.symbol
  const accountBalance = useBalance({
    address,
    chainId: mainnet.id,
  })

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: mainnet.id,
  })

  if (!address) {
    return (
      <div>
        <p className="text-center text-lg">no wallet detected...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-y-4 text-center">
      {ensAvatar && ensName && (
        <div className="flex items-center gap-x-2">
          <Image
            alt="ENS Avatar"
            src={ensAvatar}
            className="h-16 w-16 rounded-full"
            height={64}
            width={64}
          />
          {ensName && <p className="text-2xl">{ensName}</p>}
        </div>
      )}
      {address && (
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-lg">connected wallet address:</p>
          <p className="text-lg">{address}</p>
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        {accountBalance.data?.value !== undefined && (
          <p className="text-xl">
            Balance: {accountBalance.data?.formatted} {nativeTokenTicker}
          </p>
        )}
        {chain && chainId && (
          <>
            <p className="text-lg">chain: {chain.name}</p>
            <p className="text-lg">chain Id: {chainId}</p>
          </>
        )}
      </div>
    </div>
  )
}
