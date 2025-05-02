'use client'

import { type Dispatch, type SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

type AuthButtonProps = {
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>
}

export default function AuthButton({
  size = 'default',
  setIsMenuOpen,
}: AuthButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function login() {
    if (!isLoggedIn) {
      setIsLoggedIn(true)
      toast.info('mock login - set up auth flow in app')
    } else {
      toast.warning('user is already logged in')
    }
  }
  async function logout() {
    setIsLoggedIn(false)
    toast.info('mock logout - set up auth flow in app')
    setIsMenuOpen?.(false)
  }

  return (
    <Button
      onClick={isLoggedIn ? logout : login}
      size={size}
      className="font-medium"
    >
      {isLoggedIn ? 'sign out' : 'sign in'}
    </Button>
  )
}
