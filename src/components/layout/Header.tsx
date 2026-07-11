export interface HeaderProps {
  userName?: string
  userRole?: string
}

/** Purely presentational — auth data is passed in, never fetched here. */
export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-neutral-200 bg-white px-6">
      {userName && (
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-neutral-900">{userName}</p>
          {userRole && <p className="text-xs text-neutral-500">{userRole}</p>}
        </div>
      )}
    </header>
  )
}
