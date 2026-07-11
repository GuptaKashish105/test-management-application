import { paths } from '@app/router/paths'
import { Alert, Button, Modal } from '@components/ui'
import { usePublishTest } from '@features/tests'
import { cn } from '@utils/cn'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface PublishPanelProps {
  testId: string
  testName: string
  isAlreadyLive: boolean
  canPublish: boolean
  disabledReason?: string
}

/**
 * Figma shows "Publish Now" / "Schedule Publish" tabs plus a "Live Until"
 * duration picker, but the API doc only confirms `PUT /tests/:id { status:
 * "live" }` — no scheduling field exists. Schedule Publish is rendered
 * disabled (same treatment as other undocumented affordances in this app);
 * the "Live Until" picker isn't built at all, since it has no grounding in
 * either the written spec or the API (unlike e.g. Test Type, which
 * requirements.md explicitly requires as a field).
 */
const TABS = [
  { key: 'now', label: 'Publish Now', enabled: true },
  { key: 'schedule', label: 'Schedule Publish', enabled: false },
] as const

export function PublishPanel({
  testId,
  testName,
  isAlreadyLive,
  canPublish,
  disabledReason,
}: PublishPanelProps) {
  const navigate = useNavigate()
  const publishTest = usePublishTest(testId)
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['key']>('now')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  if (isAlreadyLive) {
    return <Alert tone="success">This test is already live.</Alert>
  }

  const handleConfirmPublish = () => {
    publishTest.mutate(undefined, {
      onSuccess: () => {
        setIsConfirmOpen(false)
        setIsSuccessOpen(true)
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Publish options"
        className="inline-flex gap-1 rounded-md bg-neutral-100 p-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            disabled={!tab.enabled}
            title={tab.enabled ? undefined : `${tab.label} isn't available yet`}
            onClick={() => tab.enabled && setActiveTab(tab.key)}
            className={cn(
              'rounded px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.key ? 'bg-white text-brand-700 shadow-card' : 'text-neutral-500',
              !tab.enabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!canPublish && disabledReason && <Alert tone="warning">{disabledReason}</Alert>}

      <div className="flex justify-end">
        <Button type="button" onClick={() => setIsConfirmOpen(true)} disabled={!canPublish}>
          Publish Test
        </Button>
      </div>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Publish test">
        <p className="text-sm text-neutral-700">
          Publish <strong>{testName}</strong>? It will become live and visible on the platform.
        </p>
        {publishTest.error && (
          <Alert tone="danger" className="mt-4">
            {publishTest.error.message}
          </Alert>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setIsConfirmOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirmPublish} isLoading={publishTest.isPending}>
            Confirm
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={() => navigate(paths.dashboard)} title="Test published">
        <p className="text-sm text-neutral-700">
          <strong>{testName}</strong> is now live.
        </p>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => navigate(paths.dashboard)}>
            Go to Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  )
}
