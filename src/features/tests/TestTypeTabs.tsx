import { cn } from '@utils/cn'

const TABS = [
  { value: 'chapterwise', label: 'Chapterwise', enabled: true },
  { value: 'pyq', label: 'PYQ', enabled: false },
  { value: 'mock_test', label: 'Mock Test', enabled: false },
] as const

export interface TestTypeTabsProps {
  value: string
}

/**
 * Figma shows three tabs, but the API doc only confirms `type: "chapterwise"`
 * as a valid value — PYQ/Mock Test's wire values are unconfirmed, so they're
 * rendered per the design but disabled rather than guessed at.
 */
export function TestTypeTabs({ value }: TestTypeTabsProps) {
  return (
    <div role="tablist" aria-label="Test type" className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          disabled={!tab.enabled}
          title={tab.enabled ? undefined : `${tab.label} isn't available yet`}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === tab.value ? 'bg-brand-50 text-brand-700' : 'text-neutral-400',
            !tab.enabled && 'cursor-not-allowed',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
