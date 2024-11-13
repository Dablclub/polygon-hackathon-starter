'use client'

import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  DynamicContextProvider,
  DynamicEventsCallbacks,
  mergeNetworks,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { createConfig, WagmiProvider } from 'wagmi'
import { Address, http } from 'viem'
import {
  polygon,
  polygonAmoy,
  polygonZkEvm,
  polygonZkEvmCardona,
} from 'viem/chains'
import { useRouter } from 'next/navigation'
import { customEvmNetworks } from './customNetworks'
import { fetchUserAccount } from '@/services/user'

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? undefined

const config = createConfig({
  chains: [polygon, polygonAmoy, polygonZkEvm, polygonZkEvmCardona],
  multiInjectedProviderDiscovery: false,
  transports: {
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [polygonAmoy.id]: http(
      `https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [polygonZkEvm.id]: http(
      `https://polygonzkevm-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [polygonZkEvmCardona.id]: http(
      `https://polygonzkevm-cardona.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
  },
})

const queryClient = new QueryClient()

export default function OnchainProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const events: DynamicEventsCallbacks = {
    onAuthSuccess: async ({ primaryWallet, user }) => {
      console.log('onAuthSuccess was called', primaryWallet, user)
      console.log('wallet', primaryWallet)
      console.log('user', user)
      if (!primaryWallet || !user || !user.userId || !user.username) {
        console.error(
          'Missing args from onAuthSuccess event, please check Dynamic/onchainProvider',
        )
        return
      }
      try {
        const fetchedUser = await fetchUserAccount(
          user.userId,
          primaryWallet.address as Address,
          user.username,
        )
        console.log('Succesfully fetched user:', fetchedUser)
        router.push('/account')
      } catch (error) {
        console.error(error)
        console.error('Unable to read/create user, please check the server')
      }
    },
    onLogout: (args) => {
      console.log('onLogout was called', args)
      router.push('/')
    },
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? 'ENV_ID',
        events,
        overrides: {
          evmNetworks: (networks) => mergeNetworks(customEvmNetworks, networks),
        },
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}
