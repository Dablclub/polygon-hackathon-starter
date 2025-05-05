import { createConfig } from 'wagmi'
import { baseSepolia, mainnet, polygon, polygonAmoy } from 'viem/chains'
import { http } from 'viem'
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? undefined

const wagmiConfig = createConfig({
  chains: [baseSepolia, mainnet, polygon, polygonAmoy],
  multiInjectedProviderDiscovery: false,
  transports: {
    [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
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

export default wagmiConfig
