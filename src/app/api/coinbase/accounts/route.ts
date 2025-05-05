import { NextResponse } from 'next/server'
import { CdpClient } from '@coinbase/cdp-sdk'
export async function GET() {
  const cdp = new CdpClient()

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
