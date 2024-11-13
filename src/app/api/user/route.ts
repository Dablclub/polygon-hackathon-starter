import { getOrCreateUser } from '@/helpers/getOrCreateUser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { dynamicUserId, wallet, username } = await req.json()
  if (!dynamicUserId) {
    return NextResponse.json(
      { error: 'dynamicUserId is required' },
      { status: 400 },
    )
  }
  try {
    const userAccount = await getOrCreateUser(dynamicUserId, wallet, username)

    return NextResponse.json(
      {
        userAccount,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to get or create account' },
      { status: 500 },
    )
  }
}
