import { useEffect, useState } from 'react'
import {
  UseBalanceReturnType,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
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
import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'
import { toast } from 'sonner'

type SendErc20ModalProps = {
  accountBalance: UseBalanceReturnType<{
    decimals: number
    formatted: string
    symbol: string
    value: bigint
  }>
}

export default function SendNativeTokenModal({
  accountBalance,
}: SendErc20ModalProps) {
  const [toAddress, setToAddress] = useState('')
  const [ethValue, setEthValue] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { data: hash, isPending, sendTransaction } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  console.log(accountBalance)

  async function submitSendTx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (
      parseFloat(formatEther(accountBalance.data?.value ?? BigInt(0))) === 0
    ) {
      return toast.warning("you don't have enough POL balance")
    }
    sendTransaction({
      to: toAddress as `0x${string}`,
      value: parseEther(ethValue),
    })
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
  }, [isMounted])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send POL</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Send POL</DialogTitle>
          <DialogDescription>
            The amount entered will be sent to the address once you hit the Send
            button
          </DialogDescription>
        </DialogHeader>
        {isMounted ? (
          <div className="w-full">
            <div className="flex flex-col text-center">
              <h2>
                {parseFloat(
                  formatEther(accountBalance.data?.value ?? BigInt(0)),
                ).toFixed(2)}
              </h2>
              <h4>POL</h4>
            </div>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Confirming...' : 'Send'}
              </Button>
            </form>
            {hash && (
              <div className="flex flex-col items-center pt-8">
                <Link
                  className="flex items-center gap-x-1.5 hover:text-accent"
                  href={`https://polygonscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View tx on explorer <ExternalLinkIcon className="h4 w-4" />
                </Link>
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
