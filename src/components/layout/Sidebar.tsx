import { paths } from '@app/router/paths'
import { cn } from '@utils/cn'
import { NavLink } from 'react-router-dom'

import { Logo } from './Logo'

const navItems = [
  { label: 'Dashboard', to: paths.dashboard, suppressActiveState: false },
  { label: 'Test Creation', to: paths.testCreate, suppressActiveState: false },
  // "Test Tracking" has no distinct documented data source yet — points at
  // the dashboard until/unless it's confirmed to be a separate view. Its
  // active state is suppressed so it never highlights alongside Dashboard
  // just because they happen to share a route.
  { label: 'Test Tracking', to: paths.dashboard, suppressActiveState: true },
]

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200 bg-white p-4 lg:flex">
      <div className="px-2 py-3">
        <Logo className="h-6" />
      </div>
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors',
                'hover:bg-brand-50 hover:text-brand-700',
                isActive && !item.suppressActiveState && 'bg-brand-50 text-brand-700',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
