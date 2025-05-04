import { CreateUserInput } from '@/server/schema/user-services-schema'
import { User } from '@prisma/client'

export async function fetchOrCreateUser(
  createUserData: CreateUserInput,
): Promise<{ user: User | null; error?: Error; errorMsg?: string }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createUserData),
    })

    const { user } = await res.json()

    return {
      user,
    }
  } catch (error) {
    console.error(error)
    return {
      user: null,
      error: error as Error,
      errorMsg: String(error),
    }
  }
}
