import defaultAvatar from '@/assets/Frame.png'
import notificationBellIcon from '@/assets/notification bell.png'

export interface HeaderProps {
  userName?: string
  userRole?: string
}

/**
 * Purely presentational — auth data is passed in, never fetched here. The
 * bell/avatar are static chrome (no notification API is documented, and the
 * login response's `user` object has no documented fields, so there's no
 * real per-user photo to show) — userName/userRole stay conditional since
 * there's currently no real user data anywhere in the app to populate them.
 */
export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-neutral-200 bg-white px-6">
      <img src={notificationBellIcon} alt="Notifications" className="h-8 w-8" />

      <div className="flex items-center gap-2">
        <img src={defaultAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        {userName && (
          <div className="text-left leading-tight">
            <p className="text-sm font-medium text-neutral-900">{userName}</p>
            {userRole && <p className="text-xs text-neutral-500">{userRole}</p>}
          </div>
        )}
      </div>
    </header>
  )
}
