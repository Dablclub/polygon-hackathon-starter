'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import wagmiConfig from './wagmi/wagmiConfig'
const queryClient = new QueryClient()

export default function WagmiOnchainProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
