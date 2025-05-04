import { User } from '@prisma/client'

export async function getAllUsers(authToken?: string) {
  if (!authToken) {
    return {
      users: [],
      error: new Error('No auth token provided'),
      errorMsg: 'No auth token provided',
    }
  }
  try {
    const res = await fetch(`/api/users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const { users } = await res.json()

    return {
      users: users as User[],
    }
  } catch (error) {
    console.error(error)
    return {
      users: [],
      error: error as Error,
      errorMsg: String(error),
    }
  }
}

export async function getUser(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`)

    const { user } = await res.json()

    return {
      user: user as User,
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

export async function updateUser(id: string, data: Partial<User>) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    const { user } = await res.json()

    return {
      user: user as User,
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
