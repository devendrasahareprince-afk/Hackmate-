'use client'

import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from 'sonner'
import { StoreProvider } from '@/lib/store'

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      toastOptions={{ className: 'font-sans' }}
    />
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <StoreProvider>
        {children}
        <ThemedToaster />
      </StoreProvider>
    </ThemeProvider>
  )
}
