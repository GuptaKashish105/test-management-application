import type { ApiError } from '@typings/api'
import type { AxiosRequestConfig } from 'axios'

import { createMockDatabase, DemoNotFoundError, mockDb } from './mockDatabase'

type MockDb = ReturnType<typeof createMockDatabase>

function fail(message: string, status?: number): never {
  const apiError: ApiError = { message, status }
  throw apiError
}

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Routes a request against the in-memory mock database and returns the
 * unwrapped `data` payload — mirrors what `apiRequest` returns for a real
 * request, so no caller can tell the difference. Exported with an injectable
 * `db` (defaulting to the shared singleton) purely so tests can exercise a
 * fresh, isolated database per test.
 */
export async function demoApiRequest<T>(
  config: AxiosRequestConfig,
  db: MockDb = mockDb,
): Promise<T> {
  await delay()

  const method = (config.method ?? 'GET').toUpperCase()
  const url = config.url ?? ''
  const body = (config.data ?? {}) as Record<string, unknown>

  try {
    return dispatch(method, url, body, db) as T
  } catch (error) {
    if (error instanceof DemoNotFoundError) {
      fail(error.message, 404)
    }
    throw error
  }
}

function dispatch(method: string, url: string, body: Record<string, unknown>, db: MockDb): unknown {
  if (method === 'POST' && url === '/auth/login') {
    const userId = typeof body.userId === 'string' ? body.userId.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!userId || !password) {
      fail('User ID and password are required.', 401)
    }
    return db.login(userId)
  }

  if (method === 'GET' && url === '/subjects') {
    return db.getSubjects()
  }

  const topicsBySubject = url.match(/^\/topics\/subject\/([^/]+)$/)
  if (method === 'GET' && topicsBySubject) {
    return db
      .getTopicsBySubject(topicsBySubject[1])
      .map((topic) => ({ id: topic.id, name: topic.name, subject_id: topic.subjectId }))
  }

  if (method === 'POST' && url === '/sub-topics/multi-topics') {
    const topicIds = Array.isArray(body.topicIds) ? (body.topicIds as string[]) : []
    return db
      .getSubTopicsByTopics(topicIds)
      .map((subTopic) => ({ id: subTopic.id, name: subTopic.name, topic_id: subTopic.topicId }))
  }

  if (method === 'GET' && url === '/tests') {
    return db.listTests()
  }

  const testById = url.match(/^\/tests\/([^/]+)$/)
  if (method === 'GET' && testById) {
    return db.getTest(testById[1])
  }

  if (method === 'POST' && url === '/tests') {
    return db.createTest(body)
  }

  if (method === 'PUT' && testById) {
    db.updateTest(testById[1], body)
    return undefined
  }

  if (method === 'POST' && url === '/questions/bulk') {
    const questions = Array.isArray(body.questions) ? body.questions : []
    return db.createQuestions(questions as Parameters<MockDb['createQuestions']>[0])
  }

  if (method === 'POST' && url === '/questions/fetchBulk') {
    const questionIds = Array.isArray(body.question_ids) ? (body.question_ids as string[]) : []
    return db.getQuestions(questionIds)
  }

  fail(`Demo Mode has no mock handler for ${method} ${url}`, 404)
}
