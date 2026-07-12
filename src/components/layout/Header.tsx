import { useAuth } from '@features/auth'
import { useEffect, useRef, useState } from 'react'

import defaultAvatar from '@/assets/Frame.png'
import notificationBellIcon from '@/assets/notification bell.png'

export interface HeaderProps {
  userName?: string
  userRole?: string
}

/**
 * The bell/avatar are static chrome (no notification API is documented, and the
 * login response's `user` object has no documented fields, so there's no real
 * per-user photo to show) — userName/userRole stay conditional since there's
 * currently no real user data anywhere in the app to populate them. The
 * avatar/name area opens a small menu (matching Figma's dropdown caret) whose
 * only item is Logout.
 */
export function Header({ userName, userRole }: HeaderProps) {
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMenuOpen])

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-neutral-200 bg-white px-6">
      <img src={notificationBellIcon} alt="Notifications" className="h-8 w-8" />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-neutral-50"
        >
          <img src={defaultAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          {userName && (
            <div className="text-left leading-tight">
              <p className="text-sm font-medium text-neutral-900">{userName}</p>
              {userRole && <p className="text-xs text-neutral-500">{userRole}</p>}
            </div>
          )}
          <span aria-hidden="true" className="text-xs text-neutral-400">
            ▾
          </span>
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 z-20 mt-1 w-36 rounded-md border border-neutral-200 bg-white py-1 shadow-card"
          >
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="block w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
