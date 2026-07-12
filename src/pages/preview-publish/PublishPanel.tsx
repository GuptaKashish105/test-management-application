import { Alert } from '@components/ui'
import { useState } from 'react'

export interface PublishPanelProps {
  isAlreadyLive: boolean
}

/**
 * Figma shows "Publish Now" / "Schedule Publish" tabs plus a "Live Until"
 * duration picker under BOTH tabs, but the API doc only confirms
 * `PUT /tests/:id { status: "live" }` — no scheduling/duration field exists
 * at all. The tabs and the Live Until options are rendered for visual
 * completeness (Schedule Publish disabled, Live Until inert) rather than
 * omitted outright, since they're purely decorative here and collecting
 * input that's silently discarded would be worse than not offering it.
 */
const PUBLISH_TABS = [
  { key: 'now', label: 'Publish Now', enabled: true },
  { key: 'schedule', label: 'Schedule Publish', enabled: false },
] as const

const LIVE_UNTIL_OPTIONS = [
  'Always Available',
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '1 Month',
  'Custom Duration',
]

export function PublishPanel({ isAlreadyLive }: PublishPanelProps) {
  const [activeTab, setActiveTab] = useState<(typeof PUBLISH_TABS)[number]['key']>('now')

  if (isAlreadyLive) {
    return <Alert tone="success">This test is already live.</Alert>
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Publish options"
        className="inline-flex w-fit rounded-md border border-neutral-200 p-1"
      >
        {PUBLISH_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            disabled={!tab.enabled}
            title={tab.enabled ? undefined : `${tab.label} isn't available yet`}
            onClick={() => tab.enabled && setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? 'rounded px-3 py-1.5 text-sm font-semibold text-neutral-900'
                : 'cursor-not-allowed rounded px-3 py-1.5 text-sm font-medium text-neutral-400'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <fieldset
        disabled
        title="Scheduling isn't available yet — no API field is documented for it."
      >
        <legend className="text-sm font-medium text-neutral-800">Live Until</legend>
        <p className="mt-1 text-sm text-neutral-500">
          Choose how long this test should remain available on the platform.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LIVE_UNTIL_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-neutral-400">
              <input type="radio" name="live-until" disabled className="h-4 w-4" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
