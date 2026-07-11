import { testQueryKey, testsQueryKey } from '@features/tests'
import type { CreateQuestionPayload } from '@services/questions'
import { questionsApi } from '@services/questions'
import { testsApi } from '@services/tests'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { QuestionRecord } from './questionRecord'
import { questionSchema } from './questionSchema'

export interface SaveQuestionsInput {
  testId: string
  /** Only 'draft' records — 'saved' ones are already persisted. */
  draftQuestions: QuestionRecord[]
  existingPersistedIds: string[]
  totalQuestionCount: number
  correctMarksPerQuestion: number
}

/**
 * Bulk-creates every draft question, then links the full question id set
 * (existing + newly created) to the test via `PUT /tests/:id`, updating
 * total_questions/total_marks. total_marks = count * correct_marks — inferred
 * from cross-referencing the API doc's own two examples (create: correct_marks
 * 4; update: total_questions 10 / total_marks 40 = 4/question), not guessed.
 */
export function useSaveQuestions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SaveQuestionsInput) => {
      let newIds: string[] = []

      if (input.draftQuestions.length > 0) {
        const payloadQuestions: CreateQuestionPayload[] = input.draftQuestions.map((record) => {
          const validated = questionSchema.parse(record)
          return {
            type: 'mcq',
            question: validated.question,
            option1: validated.option1,
            option2: validated.option2,
            option3: validated.option3,
            option4: validated.option4,
            correct_option: validated.correctOption,
            explanation: validated.explanation || undefined,
            difficulty: validated.difficulty || undefined,
            test_id: input.testId,
          }
        })

        const created = await questionsApi.bulkCreate(payloadQuestions)
        newIds = created.map((item) => item.id)
      }

      const allQuestionIds = [...input.existingPersistedIds, ...newIds]

      await testsApi.update(input.testId, {
        questions: allQuestionIds,
        total_questions: input.totalQuestionCount,
        total_marks: input.totalQuestionCount * input.correctMarksPerQuestion,
      })

      return { questionIds: allQuestionIds }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: testsQueryKey })
      queryClient.invalidateQueries({ queryKey: testQueryKey(variables.testId) })
    },
  })
}
