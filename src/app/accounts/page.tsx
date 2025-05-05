'use client'

import PageWithAppbar from '@/components/layout/page-wrapper'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

export default function Accounts() {
  const { mutateAsync: createAccount } = useMutation({
    mutationFn: () =>
      fetch('/api/coinbase/create-account', {
        method: 'POST',
      }),
    onSuccess: async (response) => {
      const data = await response.json()
      console.log(data)
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
      <div className="page">
        <div className="mb-4">
          <h2>accounts</h2>
        </div>
        <Button onClick={handleCreateAccount}>create account</Button>
      </div>
    </PageWithAppbar>
  )
}
