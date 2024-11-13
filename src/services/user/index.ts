import { Address } from 'viem'

export async function fetchUserAccount(
  dynamicUserId: string,
  wallet: Address,
  username: string,
) {
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dynamicUserId,
        wallet,
        username,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch or create account')
    }

    const data = await response.json()
    return data.userAccount // Returns the created or fetched user account data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
      throw error
    } else {
      console.error('An unknown error occurred')
      throw new Error('An unknown error occurred')
    }
  }
}
