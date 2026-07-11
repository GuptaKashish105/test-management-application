import { paths } from '@app/router/paths'
import { cn } from '@utils/cn'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: paths.dashboard },
  { label: 'Test Creation', to: paths.testCreate },
  // "Test Tracking" has no distinct documented data source yet — points at
  // the dashboard until/unless it's confirmed to be a separate view.
  { label: 'Test Tracking', to: paths.dashboard },
]

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white p-4">
      <div className="px-2 py-3 text-lg font-semibold text-brand-700">Preproute</div>
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors',
                'hover:bg-brand-50 hover:text-brand-700',
                isActive && 'bg-brand-50 text-brand-700',
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
