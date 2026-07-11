import { describe, expect, it, vi } from 'vitest'

import { apiRequest } from '../apiClient'
import { questionsApi } from './questionsApi'

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('questionsApi.bulkCreate', () => {
  it('posts { questions } to /questions/bulk without topic/sub-topic/media URL fields', async () => {
    mockedApiRequest.mockResolvedValueOnce([{ id: 'question-1' }])

    const result = await questionsApi.bulkCreate([
      {
        type: 'mcq',
        question: 'What is 2 + 2?',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correct_option: 'option2',
        explanation: 'Basic addition',
        difficulty: 'easy',
        test_id: 'test-1',
      },
    ])

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/questions/bulk',
      data: {
        questions: [
          {
            type: 'mcq',
            question: 'What is 2 + 2?',
            option1: '3',
            option2: '4',
            option3: '5',
            option4: '6',
            correct_option: 'option2',
            explanation: 'Basic addition',
            difficulty: 'easy',
            test_id: 'test-1',
          },
        ],
      },
    })
    expect(result).toEqual([{ id: 'question-1' }])
  })
})

describe('questionsApi.fetchBulk', () => {
  it('posts question_ids to /questions/fetchBulk and normalizes the response', async () => {
    mockedApiRequest.mockResolvedValueOnce([
      {
        id: 'question-1',
        question: 'What is 2 + 2?',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correct_option: 'option2',
        explanation: 'Basic addition',
        difficulty: 'easy',
      },
    ])

    const result = await questionsApi.fetchBulk(['question-1'])

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/questions/fetchBulk',
      data: { question_ids: ['question-1'] },
    })
    expect(result).toEqual([
      {
        id: 'question-1',
        question: 'What is 2 + 2?',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correctOption: 'option2',
        explanation: 'Basic addition',
        difficulty: 'easy',
      },
    ])
  })
})
