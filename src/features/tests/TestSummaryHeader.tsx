import { Badge } from '@components/ui'
import type { TestDetail } from '@services/tests'

export interface TestSummaryHeaderProps {
  test: TestDetail
}

/** Shared between Add Questions and Preview & Publish — both steps show the same test summary chrome. */
export function TestSummaryHeader({ test }: TestSummaryHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">Chapter Wise</Badge>
          <h1 className="text-lg font-semibold text-neutral-900">{test.name}</h1>
          {test.difficulty && (
            <Badge tone="success" className="capitalize">
              {test.difficulty}
            </Badge>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
          <span>Subject: {test.subjectName}</span>
          {test.topicNames.length > 0 && <span>Topics: {test.topicNames.join(', ')}</span>}
        </div>
      </div>
      <div className="flex gap-4 text-sm text-neutral-600">
        {test.totalTime !== null && <span>{test.totalTime} Min</span>}
        {test.totalQuestions !== null && <span>{test.totalQuestions} Q&apos;s</span>}
        {test.totalMarks !== null && <span>{test.totalMarks} Marks</span>}
      </div>
    </div>
  )
}
