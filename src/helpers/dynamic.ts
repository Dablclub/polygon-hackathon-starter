import { MiddlewarePayload } from '@/types/dynamic'
import { UserProfile } from '@dynamic-labs/types'

export function getDynamicCredentials(user: UserProfile): {
  id: string
  email: string
  appWallet: string
  extWallet: string
} {
  if (!user.userId) {
    throw new Error(
      'Authentication failed: user id is missing (Dynamic service)',
    )
  }

  const emailCredentials = user.verifiedCredentials
    .filter((cred) => cred.format === 'email')
    .map((cred) => cred.email)

  const embeddedWallets = user.verifiedCredentials
    .filter((cred) => cred.walletProvider === 'embeddedWallet')
    .map((cred) => cred.address)

  const externalWallets = user.verifiedCredentials
    .filter(
      (cred) =>
        cred.chain === 'eip155' && cred.walletProvider !== 'embeddedWallet',
    )
    .map((cred) => cred.address)

  if (!embeddedWallets[0]) {
    console.error(
      'Missing credentials (embedded wallet), please check Dynamic/onchainProvider',
    )
    return {
      id: user.userId,
      email: '',
      appWallet: '',
      extWallet: '',
    }
  }

  return {
    id: user.userId,
    email: emailCredentials[0] ?? '',
    appWallet: embeddedWallets[0] ?? '',
    extWallet: externalWallets[0] ?? '',
  }
}

export function getDynamicCredentialsFromPayload(payload: MiddlewarePayload) {
  const emailCredentials = payload.verified_credentials
    .filter((cred) => cred.format === 'email')
    .map((cred) => cred.email)

  const embeddedWallets = payload.verified_credentials
    .filter((cred) => cred.wallet_provider === 'embeddedWallet')
    .map((cred) => cred.address)

  const externalWallets = payload.verified_credentials
    .filter(
      (cred) =>
        cred.chain === 'eip155' && cred.wallet_provider !== 'embeddedWallet',
    )
    .map((cred) => cred.address)

  return {
    email: emailCredentials[0],
    appWallet: embeddedWallets[0],
    extWallet: externalWallets[0],
    role: (payload.metadata?.Role as string) || 'ANON',
  }
}
