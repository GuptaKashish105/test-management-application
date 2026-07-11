import { Badge, Button } from '@components/ui'
import type { QuestionRecord } from '@features/questions'
import { isQuestionComplete } from '@features/questions'
import { cn } from '@utils/cn'

export interface QuestionSidebarProps {
  questions: QuestionRecord[]
  selectedClientId: string | null
  onSelect: (clientId: string) => void
  onDelete: (clientId: string) => void
  onAdd: () => void
}

export function QuestionSidebar({
  questions,
  selectedClientId,
  onSelect,
  onDelete,
  onAdd,
}: QuestionSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-sm font-medium text-neutral-800">Total Questions: {questions.length}</p>

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {questions.map((record, index) => {
          const complete = record.status === 'saved' || isQuestionComplete(record)
          const isSelected = record.clientId === selectedClientId

          return (
            <li key={record.clientId} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(record.clientId)}
                aria-current={isSelected}
                className={cn(
                  'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm',
                  isSelected ? 'bg-brand-50 text-brand-700' : 'text-neutral-700 hover:bg-neutral-50',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    complete ? 'bg-success-500' : 'bg-neutral-300',
                  )}
                />
                <span className="truncate">Question {index + 1}</span>
                {record.status === 'saved' && <Badge tone="success">Saved</Badge>}
              </button>
              {record.status === 'draft' && (
                <button
                  type="button"
                  aria-label={`Delete Question ${index + 1}`}
                  onClick={() => onDelete(record.clientId)}
                  className="shrink-0 rounded p-1 text-neutral-400 hover:text-danger-700"
                >
                  ✕
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
        Add Another Question
      </Button>
    </div>
  )
}
