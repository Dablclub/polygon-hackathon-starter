'use client'

import PageWithAppbar from '@/components/layout/page-wrapper'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { truncateString } from '@/lib/utils'
import Link from 'next/link'
interface CoinbaseAccount {
  address: string
  type: string
}

export default function Accounts() {
  const { data: accounts, refetch: refetchAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/coinbase/accounts')
      const data = await res.json()
      return data.accounts as CoinbaseAccount[]
    },
  })

  const { mutateAsync: createAccount, isPending: isCreatingAccount } =
    useMutation({
      mutationFn: () =>
        fetch('/api/coinbase/accounts/create', {
          method: 'POST',
        }),
      onSuccess: async (response) => {
        const data = await response.json()
        console.log(data)
        toast.success(
          `New account created: ${truncateString(data.account.address)}`,
        )
        await refetchAccounts()
      },
      onError: (error) => {
        console.error(error)
      },
    })

  const handleCreateAccount = async () => {
    try {
      const res = await createAccount()
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PageWithAppbar>
      <div className="page gap-y-4">
        <div className="flex w-full flex-col items-center gap-y-4">
          <h2>accounts</h2>
          <Button onClick={handleCreateAccount} disabled={isCreatingAccount}>
            {isCreatingAccount ? 'creating...' : 'create account'}
          </Button>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your Coinbase accounts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Address</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts && accounts.length ? (
                accounts
                  .slice()
                  .reverse()
                  .map((account) => (
                    <TableRow key={account.address}>
                      <TableCell className="font-medium">
                        <Link href={`/accounts/${account.address}`}>
                          {account.address}
                        </Link>
                      </TableCell>
                      <TableCell>{account.type}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No accounts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageWithAppbar>
  )
}
