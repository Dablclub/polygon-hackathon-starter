'use client'

import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi'
import { useEffect, useState } from 'react'
import { mainnet } from 'viem/chains'
import Image from 'next/image'
import SendNativeTokenModal from './sendNativeTokenModal'
import SendErc20Modal from './sendErc20Modal'
import SwitchNetworkModal from './switchChainModal'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export function ConnectedAccount() {
  const [isMounted, setIsMounted] = useState(false)

  const { sdkHasLoaded, user } = useDynamicContext()
  const { address, chain, chainId } = useAccount()

  const accountBalance = useBalance({
    address,
  })

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: mainnet.id,
  })

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
  }, [isMounted])

  if (!isMounted || !sdkHasLoaded) {
    return (
      <div>
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (status === 'disconnected' && sdkHasLoaded) {
    return (
      <div>
        <p className="text-center text-lg">not connected</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-y-4 text-center">
      <div className="flex flex-col items-center gap-y-2">
        <p className="text-lg">welcome {user?.username}</p>
      </div>
      {ensAvatar && ensName && isMounted && (
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
      {address && isMounted && (
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-lg">connected wallet address:</p>
          <p className="text-lg">{address}</p>
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        {accountBalance.data?.value !== undefined && isMounted && (
          <p className="text-xl">
            Balance: {accountBalance.data?.formatted} POL
          </p>
        )}
        {chain && chainId && isMounted && (
          <>
            <p className="text-lg">chain: {chain.name}</p>
            <p className="text-lg">chain Id: {chainId}</p>
          </>
        )}
      </div>
      <div className="flex w-full justify-center gap-x-4 px-4">
        <div className="w-1/3">
          {chainId === 80002 ? (
            <SendNativeTokenModal accountBalance={accountBalance} />
          ) : (
            <SwitchNetworkModal buttonText="Send POL" requiredChainId={80002} />
          )}
        </div>
        <div className="w-1/3">
          {chainId === 80002 ? (
            <SendErc20Modal userAddress={address} />
          ) : (
            <SwitchNetworkModal
              buttonText="Send ERC20"
              requiredChainId={80002}
            />
          )}
        </div>
      </div>
    </div>
  )
}
