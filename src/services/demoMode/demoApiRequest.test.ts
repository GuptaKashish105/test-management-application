import { describe, expect, it } from 'vitest'

import { demoApiRequest } from './demoApiRequest'
import { createMockDatabase } from './mockDatabase'

interface RawTestListItem {
  id: string
  name: string
  subject: string
  topics: string[]
  status: string | null
}

interface RawTestDetail extends RawTestListItem {
  sub_topics: string[]
  questions: string[]
  total_questions: number
  total_marks: number
}

describe('demoApiRequest', () => {
  it('logs in with any non-empty credentials', async () => {
    const db = createMockDatabase()
    const result = await demoApiRequest<{ token: string }>(
      { method: 'POST', url: '/auth/login', data: { userId: 'demo-admin', password: 'anything' } },
      db,
    )
    expect(result.token).toContain('demo-admin')
  })

  it('rejects login with empty credentials', async () => {
    const db = createMockDatabase()
    await expect(
      demoApiRequest(
        { method: 'POST', url: '/auth/login', data: { userId: '', password: '' } },
        db,
      ),
    ).rejects.toMatchObject({ status: 401 })
  })

  it('lists seeded subjects', async () => {
    const db = createMockDatabase()
    const result = await demoApiRequest<{ id: string; name: string }[]>(
      { method: 'GET', url: '/subjects' },
      db,
    )
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((subject) => subject.name === 'Mathematics')).toBe(true)
  })

  it('scopes topics to the requested subject', async () => {
    const db = createMockDatabase()
    const subjects = await demoApiRequest<{ id: string; name: string }[]>(
      { method: 'GET', url: '/subjects' },
      db,
    )
    const mathematics = subjects.find((subject) => subject.name === 'Mathematics')
    expect(mathematics).toBeDefined()

    const topics = await demoApiRequest<{ id: string; name: string; subject_id: string }[]>(
      { method: 'GET', url: `/topics/subject/${mathematics?.id}` },
      db,
    )
    expect(topics.length).toBeGreaterThan(0)
    expect(topics.every((topic) => topic.subject_id === mathematics?.id)).toBe(true)
  })

  it('scopes sub-topics to the requested topics', async () => {
    const db = createMockDatabase()
    const subjects = await demoApiRequest<{ id: string; name: string }[]>(
      { method: 'GET', url: '/subjects' },
      db,
    )
    const mathematics = subjects.find((subject) => subject.name === 'Mathematics')
    const topics = await demoApiRequest<{ id: string; name: string; subject_id: string }[]>(
      { method: 'GET', url: `/topics/subject/${mathematics?.id}` },
      db,
    )
    const topicIds = topics.map((topic) => topic.id)

    const subTopics = await demoApiRequest<{ id: string; name: string; topic_id: string }[]>(
      { method: 'POST', url: '/sub-topics/multi-topics', data: { topicIds } },
      db,
    )
    expect(subTopics.length).toBeGreaterThan(0)
    expect(subTopics.every((subTopic) => topicIds.includes(subTopic.topic_id))).toBe(true)
  })

  it('lists seeded tests, including at least one live test', async () => {
    const db = createMockDatabase()
    const tests = await demoApiRequest<RawTestListItem[]>({ method: 'GET', url: '/tests' }, db)
    expect(tests.length).toBeGreaterThan(0)
    expect(tests.some((test) => test.status === 'live')).toBe(true)
  })

  it('fetches a single seeded test with its full detail shape', async () => {
    const db = createMockDatabase()
    const tests = await demoApiRequest<RawTestListItem[]>({ method: 'GET', url: '/tests' }, db)
    const seeded = tests[0]

    const detail = await demoApiRequest<RawTestDetail>(
      { method: 'GET', url: `/tests/${seeded.id}` },
      db,
    )
    expect(detail.id).toBe(seeded.id)
    expect(detail.name).toBe(seeded.name)
  })

  it('rejects fetching a test id that does not exist', async () => {
    const db = createMockDatabase()
    await expect(
      demoApiRequest({ method: 'GET', url: '/tests/does-not-exist' }, db),
    ).rejects.toMatchObject({ status: 404 })
  })

  it('creates a test and makes it immediately readable', async () => {
    const db = createMockDatabase()
    const created = await demoApiRequest<{ id: string; name: string }>(
      {
        method: 'POST',
        url: '/tests',
        data: {
          name: 'Brand New Test',
          type: 'chapterwise',
          subject: 'subject-mathematics',
          topics: [],
          sub_topics: [],
          correct_marks: 4,
          wrong_marks: -1,
          unattempt_marks: 0,
          difficulty: 'easy',
          total_time: 30,
          total_marks: 0,
          total_questions: 0,
          status: null,
        },
      },
      db,
    )
    expect(created.name).toBe('Brand New Test')

    const detail = await demoApiRequest<RawTestDetail>(
      { method: 'GET', url: `/tests/${created.id}` },
      db,
    )
    expect(detail.name).toBe('Brand New Test')
    expect(detail.subject).toBe('Mathematics')
  })

  it('updates a test in place, including linking question ids', async () => {
    const db = createMockDatabase()
    const tests = await demoApiRequest<RawTestListItem[]>({ method: 'GET', url: '/tests' }, db)
    const draftTest = tests.find((test) => test.status !== 'live')
    expect(draftTest).toBeDefined()

    await demoApiRequest(
      {
        method: 'PUT',
        url: `/tests/${draftTest?.id}`,
        data: { questions: ['question-a', 'question-b'], total_questions: 2, total_marks: 8 },
      },
      db,
    )

    const updated = await demoApiRequest<RawTestDetail>(
      { method: 'GET', url: `/tests/${draftTest?.id}` },
      db,
    )
    expect(updated.questions).toEqual(['question-a', 'question-b'])
    expect(updated.total_questions).toBe(2)
  })

  it('publishes a test by setting status to live', async () => {
    const db = createMockDatabase()
    const tests = await demoApiRequest<RawTestListItem[]>({ method: 'GET', url: '/tests' }, db)
    const draftTest = tests.find((test) => test.status !== 'live')

    await demoApiRequest(
      { method: 'PUT', url: `/tests/${draftTest?.id}`, data: { status: 'live' } },
      db,
    )

    const updated = await demoApiRequest<RawTestDetail>(
      { method: 'GET', url: `/tests/${draftTest?.id}` },
      db,
    )
    expect(updated.status).toBe('live')
  })

  it('bulk-creates questions and fetches them back by id', async () => {
    const db = createMockDatabase()
    const created = await demoApiRequest<{ id: string }[]>(
      {
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
              test_id: 'test-algebra-basics',
            },
          ],
        },
      },
      db,
    )
    expect(created).toHaveLength(1)

    const fetched = await demoApiRequest<{ id: string; question: string }[]>(
      {
        method: 'POST',
        url: '/questions/fetchBulk',
        data: { question_ids: created.map((item) => item.id) },
      },
      db,
    )
    expect(fetched).toHaveLength(1)
    expect(fetched[0].question).toBe('What is 2 + 2?')
  })

  it('rejects an unrecognized route', async () => {
    const db = createMockDatabase()
    await expect(
      demoApiRequest({ method: 'DELETE', url: '/tests/anything' }, db),
    ).rejects.toMatchObject({ status: 404 })
  })
})
