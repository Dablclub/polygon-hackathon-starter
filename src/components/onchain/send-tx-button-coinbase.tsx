import { useState } from 'react'
import { Address, Chain, isAddress } from 'viem'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'

type SendErc20ModalProps = {
  fromAddress: Address
  chain: Chain
}

export default function SendTransactionCoinbaseModal({
  fromAddress,
  chain,
}: SendErc20ModalProps) {
  const [toAddress, setToAddress] = useState('')
  const [ethValue, setEthValue] = useState('')
  const [hash, setHash] = useState<string | null>(null)

  const { mutateAsync: sendTransaction, isPending: isSendingTransaction } =
    useMutation({
      mutationFn: async () => {
        if (!toAddress || !isAddress(toAddress)) {
          return toast.error('Invalid to address')
        }
        const response = await fetch(
          `/api/coinbase/wallet-api/send-transaction?fromAddress=${fromAddress}&toAddress=${toAddress}&amount=${ethValue}`,
          {
            method: 'POST',
          },
        )
        const data = await response.json()
        console.log(data)
        return data
      },
      onSuccess: (data) => {
        setHash(data.transactionHash)
        setEthValue('')
        setToAddress('')
      },
    })

  async function submitSendTx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setHash(null)
    try {
      await sendTransaction()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send {chain.nativeCurrency.symbol}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Send {chain.nativeCurrency.symbol}
          </DialogTitle>
          <DialogDescription>
            The amount entered will be sent to the address once you hit the Send
            button
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <form
            className="flex w-full flex-col gap-y-2"
            onSubmit={submitSendTx}
          >
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                name="address"
                placeholder="0xA0Cf…251e"
                required
                onChange={(event) => setToAddress(event.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="value">Amount</Label>
              <Input
                name="value"
                placeholder="0.05"
                required
                onChange={(event) => setEthValue(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSendingTransaction}>
              {isSendingTransaction ? 'confirming...' : 'send'}
            </Button>

            {isSendingTransaction && <div>Waiting for confirmation...</div>}
            {hash && (
              <div className="flex flex-col items-center pt-8">
                <Link
                  className="flex items-center gap-x-1.5 hover:text-accent"
                  href={`https://sepolia.basescan.org//tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View tx on explorer <ExternalLinkIcon className="h4 w-4" />
                </Link>
                {hash && <div>Transaction confirmed.</div>}
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
