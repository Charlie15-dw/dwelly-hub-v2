'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

// Shared open/close state for the mobile navigation drawer. The Header's
// hamburger toggles it; the Sidebar reads it to slide in/out on small
// screens. On large screens the sidebar is always visible and this state is
// ignored.
interface SidebarState {
  open: boolean
  toggle: () => void
  close: () => void
}

const SidebarCtx = createContext<SidebarState>({
  open: false,
  toggle: () => {},
  close: () => {},
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <SidebarCtx.Provider
      value={{ open, toggle: () => setOpen(o => !o), close: () => setOpen(false) }}
    >
      {children}
    </SidebarCtx.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarCtx)
}
