import { Badge } from '@components/ui'
import type { Question } from '@services/questions'
import { cn } from '@utils/cn'

export interface QuestionsReviewProps {
  questions: Question[]
}

const OPTION_KEYS = ['option1', 'option2', 'option3', 'option4'] as const

export function QuestionsReview({ questions }: QuestionsReviewProps) {
  if (questions.length === 0) {
    return (
      <p className="py-8 text-center text-neutral-500">
        No questions have been added to this test yet.
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-4">
      {questions.map((question, index) => (
        <li
          key={question.id}
          id={`question-${question.id}`}
          className="scroll-mt-6 rounded-lg border border-neutral-200 bg-white p-4"
        >
          <p className="text-sm font-medium text-neutral-900">
            {index + 1}. {question.question}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {OPTION_KEYS.map((key) => {
              const isCorrect = question.correctOption === key
              return (
                <li
                  key={key}
                  className={cn(
                    'rounded-md border px-3 py-2 text-sm',
                    isCorrect
                      ? 'border-success-500 bg-success-50 text-success-700'
                      : 'border-neutral-200 text-neutral-700',
                  )}
                >
                  {question[key]}
                  {isCorrect && (
                    <Badge tone="success" className="ml-2">
                      Correct
                    </Badge>
                  )}
                </li>
              )
            })}
          </ul>
          {question.explanation && (
            <p className="mt-3 text-sm text-neutral-600">
              <span className="font-medium">Explanation: </span>
              {question.explanation}
            </p>
          )}
          {question.difficulty && (
            <Badge tone="neutral" className="mt-2 capitalize">
              {question.difficulty}
            </Badge>
          )}
        </li>
      ))}
    </ol>
  )
}
