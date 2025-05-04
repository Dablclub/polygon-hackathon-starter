'use client'

import { Suspense, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  DynamicContextProvider,
  DynamicEventsCallbacks,
  DynamicHandlers,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { createConfig, WagmiProvider } from 'wagmi'
import { http } from 'viem'
import { mainnet, polygon, polygonAmoy } from 'viem/chains'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getDynamicCredentials } from '@/helpers/dynamic'
import { fetchOrCreateUser } from '@/services/auth-services'

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? undefined

const config = createConfig({
  chains: [mainnet, polygon, polygonAmoy],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [polygonAmoy.id]: http(
      `https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
  },
})

const queryClient = new QueryClient()

function OnchainProviderComponent({ children }: { children: ReactNode }) {
  const router = useRouter()

  // Dynamic async callback for logs + logout
  const events: DynamicEventsCallbacks = {
    onLogout: (args) => {
      console.log('onLogout was called', args)
      toast.info('logged out, come back soon!')
      router.push('/')
    },
  }

  // Dynamic sync callbacks for successful auth
  const handlers: DynamicHandlers = {
    handleAuthenticatedUser: async ({ user: dynamicUser }) => {
      const { id, email, appWallet, extWallet } =
        getDynamicCredentials(dynamicUser)
      try {
        const { user } = await fetchOrCreateUser({
          id,
          email,
          appWallet,
          extWallet,
        })

        if (user) {
          toast.success('Welcome back! 🍄')
          router.push('/account')
        } else {
          toast.warning('Unable to load your account')
          router.push('/')
        }
      } catch (error) {
        console.error(error)
        toast.warning('Unable to load your account')
        router.push('/')
      }
    },
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? 'ENV_ID',
        events,
        handlers,
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

// Main export with Suspense
export default function OnchainProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <OnchainProviderComponent>{children}</OnchainProviderComponent>
    </Suspense>
  )
}
