import { describe, expect, it, vi } from 'vitest'

import { apiRequest } from '../apiClient'
import { testsApi } from './testsApi'

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('testsApi.getAll', () => {
  it('fetches /tests and normalizes each item', async () => {
    mockedApiRequest.mockResolvedValueOnce([
      {
        id: 'test-1',
        name: 'Sample Test',
        subject: 'Mathematics',
        topics: ['Algebra', 'Geometry'],
        status: 'draft',
        created_at: '2025-01-15T10:00:00Z',
      },
    ])

    const tests = await testsApi.getAll()

    expect(mockedApiRequest).toHaveBeenCalledWith({ method: 'GET', url: '/tests' })
    expect(tests).toEqual([
      {
        id: 'test-1',
        name: 'Sample Test',
        subject: 'Mathematics',
        topics: ['Algebra', 'Geometry'],
        status: 'draft',
        createdAt: '2025-01-15T10:00:00Z',
      },
    ])
  })

  it('returns an empty array when there are no tests', async () => {
    mockedApiRequest.mockResolvedValueOnce([])
    const tests = await testsApi.getAll()
    expect(tests).toEqual([])
  })

  it('propagates errors from the API layer', async () => {
    mockedApiRequest.mockRejectedValueOnce({ message: 'Network error' })
    await expect(testsApi.getAll()).rejects.toEqual({ message: 'Network error' })
  })
})

describe('testsApi.getById', () => {
  it('fetches /tests/:id and normalizes it into a TestDetail', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      id: 'test-1',
      name: 'Sample Test',
      subject: 'Mathematics',
      topics: ['Algebra'],
      questions: ['q1-uuid'],
      sub_topics: ['Linear Equations'],
      type: 'chapterwise',
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
      difficulty: 'medium',
      total_time: 60,
      total_marks: 250,
      total_questions: 50,
      status: 'draft',
    })

    const test = await testsApi.getById('test-1')

    expect(mockedApiRequest).toHaveBeenCalledWith({ method: 'GET', url: '/tests/test-1' })
    expect(test).toEqual({
      id: 'test-1',
      name: 'Sample Test',
      subjectName: 'Mathematics',
      topicNames: ['Algebra'],
      subTopicNames: ['Linear Equations'],
      type: 'chapterwise',
      difficulty: 'medium',
      correctMarks: 4,
      wrongMarks: -1,
      unattemptMarks: 0,
      totalTime: 60,
      totalMarks: 250,
      totalQuestions: 50,
      status: 'draft',
      questionIds: ['q1-uuid'],
    })
  })

  it('degrades gracefully when optional fields are absent from the response', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      id: 'test-1',
      name: 'Sample Test',
      subject: 'Mathematics',
      topics: ['Algebra'],
      questions: [],
    })

    const test = await testsApi.getById('test-1')

    expect(test.subTopicNames).toEqual([])
    expect(test.type).toBeNull()
    expect(test.difficulty).toBeNull()
    expect(test.correctMarks).toBeNull()
  })
})

describe('testsApi.create', () => {
  it('posts the payload to /tests', async () => {
    mockedApiRequest.mockResolvedValueOnce({ id: 'new-test-id', name: 'Sample Test' })

    const payload = {
      name: 'Sample Test',
      type: 'chapterwise' as const,
      subject: 'subject-uuid',
      topics: ['topic-uuid'],
      sub_topics: [],
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
      difficulty: 'medium' as const,
      total_time: 60,
      total_marks: 250,
      total_questions: 50,
      status: null,
    }

    const result = await testsApi.create(payload)

    expect(mockedApiRequest).toHaveBeenCalledWith({ method: 'POST', url: '/tests', data: payload })
    expect(result).toEqual({ id: 'new-test-id', name: 'Sample Test' })
  })
})

describe('testsApi.update', () => {
  it('puts the payload to /tests/:id', async () => {
    mockedApiRequest.mockResolvedValueOnce(undefined)

    await testsApi.update('test-1', { name: 'Updated Name' })

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/tests/test-1',
      data: { name: 'Updated Name' },
    })
  })
})

describe('testsApi.publish', () => {
  it('puts exactly { status: "live" } to /tests/:id, matching the documented payload', async () => {
    mockedApiRequest.mockResolvedValueOnce(undefined)

    await testsApi.publish('test-1')

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/tests/test-1',
      data: { status: 'live' },
    })
  })
})
