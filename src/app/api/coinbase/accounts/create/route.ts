import { NextResponse } from 'next/server'
import cdp from '@/server/clients/cdp'

export async function POST() {
  const account = await cdp.evm.createAccount()
  console.log(`Created EVM account: ${account.address}`)

  return NextResponse.json({ account }, { status: 200 })
}
