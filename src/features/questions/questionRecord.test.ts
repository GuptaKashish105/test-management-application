import { describe, expect, it } from 'vitest'

import { createBlankQuestionRecord, questionToRecord } from './questionRecord'

describe('createBlankQuestionRecord', () => {
  it('creates a draft record with empty fields and a unique clientId', () => {
    const a = createBlankQuestionRecord()
    const b = createBlankQuestionRecord()

    expect(a.status).toBe('draft')
    expect(a.question).toBe('')
    expect(a.persistedId).toBeUndefined()
    expect(a.clientId).not.toBe(b.clientId)
  })
})

describe('questionToRecord', () => {
  it('maps a persisted Question into a read-only saved record', () => {
    const record = questionToRecord({
      id: 'question-1',
      question: 'What is 2 + 2?',
      option1: '3',
      option2: '4',
      option3: '5',
      option4: '6',
      correctOption: 'option2',
      explanation: 'Basic addition',
      difficulty: 'easy',
    })

    expect(record.status).toBe('saved')
    expect(record.persistedId).toBe('question-1')
    expect(record.clientId).toBe('question-1')
    expect(record.correctOption).toBe('option2')
    // topic/sub-topic/media URL were never sent to the API, so there's nothing to restore them from.
    expect(record.topicId).toBe('')
    expect(record.subTopicId).toBe('')
    expect(record.mediaUrl).toBe('')
  })

  it('defaults a null difficulty to an empty string', () => {
    const record = questionToRecord({
      id: 'question-1',
      question: 'Q',
      option1: 'a',
      option2: 'b',
      option3: 'c',
      option4: 'd',
      correctOption: 'option1',
      explanation: '',
      difficulty: null,
    })
    expect(record.difficulty).toBe('')
  })
})
