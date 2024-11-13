'use client';

import { useEffect, useState } from 'react';
import { useSwitchChain } from 'wagmi';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function SwitchChainModal({
  buttonText,
  requiredChainId,
}: {
  buttonText: string;
  requiredChainId: number;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { chains, switchChain } = useSwitchChain({
    mutation: {
      onSuccess(data) {
        console.log(data);
        toast.success(`Changed to ${data.name} chain`);
        return null;
      },
    },
  });
  const [selectedChain] = chains.filter(
    (chain) => chain.id === requiredChainId
  );

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  function handleSwitchChain() {
    switchChain({ chainId: selectedChain.id });
    toast.info(`Accept change to ${selectedChain.name} chain`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Switch Chain</DialogTitle>
          <DialogDescription>
            {`This action is only enabled for ${selectedChain.name}. You need to switch chain`}
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleSwitchChain}>
          {`Switch to ${selectedChain.name}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
