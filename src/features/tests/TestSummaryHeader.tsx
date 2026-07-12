import { Badge } from '@components/ui'
import type { TestDetail } from '@services/tests'

export interface TestSummaryHeaderProps {
  test: TestDetail
  /** Pencil icon shown at the top-right of the card — omitted where the page already has its own Edit affordance. */
  onEdit?: () => void
}

/** Shared between Add Questions and Preview & Publish — both steps show the same test summary chrome. */
export function TestSummaryHeader({ test, onEdit }: TestSummaryHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">Chapter Wise</Badge>
          <h1 className="text-lg font-semibold text-neutral-900">{test.name}</h1>
          {test.difficulty && (
            <Badge tone="success" className="capitalize">
              {test.difficulty}
            </Badge>
          )}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit test details"
            className="text-neutral-400 hover:text-brand-700"
          >
            ✎
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
          <span>Subject : {test.subjectName}</span>
          {test.topicNames.length > 0 && (
            <span className="flex flex-wrap items-center gap-1">
              Topic :
              {test.topicNames.map((name) => (
                <Badge key={name} tone="warning">
                  {name}
                </Badge>
              ))}
            </span>
          )}
          {test.subTopicNames.length > 0 && (
            <span className="flex flex-wrap items-center gap-1">
              Sub Topic :
              {test.subTopicNames.map((name) => (
                <Badge key={name} tone="warning">
                  {name}
                </Badge>
              ))}
            </span>
          )}
        </div>
        <div className="flex gap-4 text-sm text-neutral-600">
          {test.totalTime !== null && <span>{test.totalTime} Min</span>}
          {test.totalQuestions !== null && <span>{test.totalQuestions} Q&apos;s</span>}
          {test.totalMarks !== null && <span>{test.totalMarks} Marks</span>}
        </div>
      </div>
    </div>
  )
}
