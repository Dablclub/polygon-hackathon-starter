import { NextRequest, NextResponse } from 'next/server'
import { UserController } from '@/server/controllers/user-controller'
import { AppError } from '@/server/utils/errors'

export async function POST(req: NextRequest) {
  try {
    const { id, appWallet, email, extWallet } = await req.json()

    if (!id || !appWallet) {
      return NextResponse.json(
        { error: 'id and appWallet are required' },
        { status: 400 },
      )
    }

    const user = await UserController.findOrCreate({
      id,
      appWallet: appWallet.toLowerCase(),
      extWallet: extWallet?.toLowerCase(),
      email,
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      )
    }

    console.error(error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    )
  }
}
