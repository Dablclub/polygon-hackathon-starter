import cdp from '@/server/clients/cdp'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await cdp.evm.listAccounts({
      pageSize: 100,
    })
    return NextResponse.json({ accounts: res.accounts })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to list accounts' },
      { status: 500 },
    )
  }
}
