import React, { ReactNode, useEffect, useState } from 'react'
import { Header } from './header'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div>
      <Header
        className={isScrolled ? 'bg-white shadow-md' : ''}
        style={{ position: 'fixed', width: '100%', zIndex: 1000 }}
      />
      <div>{children}</div>
    </div>
  )
}
