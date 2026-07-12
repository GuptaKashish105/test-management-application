import { QuestionSidebarHeader } from '@features/questions'
import type { Question } from '@services/questions'

export interface QuestionsSidebarProps {
  questions: Question[]
}

/** Read-only nav list — every question here is already saved, so no status/delete affordances apply. */
export function QuestionsSidebar({ questions }: QuestionsSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <QuestionSidebarHeader count={questions.length} />

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {questions.map((question, index) => (
          <li key={question.id}>
            <a
              href={`#question-${question.id}`}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-success-500" />
              <span className="flex-1 truncate">Question {index + 1}</span>
              <span aria-hidden="true" className="text-neutral-300">
                ›
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
