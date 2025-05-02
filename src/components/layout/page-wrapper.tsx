import React from 'react'

import Navbar from './navbar'
import Footer from './footer'

const NAVBAR_HEIGHT = '64px' // 5rem / h-20 tw

export interface NavbarProps {
  title?: string
  navTitle?: string
}

const PageWrapper: React.FC<NavbarProps & { children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navbar />
      <main
        className={`min-h-[calc(100vh-64px)] top-[${NAVBAR_HEIGHT}] flex w-full flex-col items-center overflow-x-hidden`}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}

export default PageWrapper
