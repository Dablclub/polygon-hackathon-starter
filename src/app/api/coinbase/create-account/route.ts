import { NextResponse } from 'next/server'
import { CdpClient } from '@coinbase/cdp-sdk'

export async function POST() {
  const cdp = new CdpClient()
  const account = await cdp.evm.createAccount()
  console.log(`Created EVM account: ${account.address}`)

  return NextResponse.json({ account }, { status: 200 })
}
