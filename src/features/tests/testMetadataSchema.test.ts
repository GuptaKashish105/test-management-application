import { describe, expect, it } from 'vitest'

import { testMetadataSchema } from './testMetadataSchema'

const validInput = {
  name: 'Sample Test',
  type: 'chapterwise' as const,
  subject: 'subject-uuid',
  topics: ['topic-uuid-1'],
  subTopics: ['subtopic-uuid-1'],
  difficulty: 'medium',
  correctMarks: 4,
  wrongMarks: -1,
  unattemptMarks: 0,
  totalTime: 60,
  totalMarks: 250,
  totalQuestions: 50,
}

describe('testMetadataSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = testMetadataSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('requires a non-empty name', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, name: '  ' })
    expect(result.success).toBe(false)
  })

  it('requires a subject', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, subject: '' })
    expect(result.success).toBe(false)
  })

  it('requires at least one topic', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, topics: [] })
    expect(result.success).toBe(false)
  })

  it('allows an empty sub-topics array', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, subTopics: [] })
    expect(result.success).toBe(true)
  })

  it('rejects a difficulty outside the documented easy/medium/difficult set', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, difficulty: 'extreme' })
    expect(result.success).toBe(false)
  })

  it('rejects a test type other than chapterwise', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, type: 'pyq' })
    expect(result.success).toBe(false)
  })

  it('coerces numeric string inputs (native number fields submit strings)', () => {
    const result = testMetadataSchema.safeParse({
      ...validInput,
      correctMarks: '4',
      wrongMarks: '-1',
      totalTime: '60',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.correctMarks).toBe(4)
      expect(result.data.wrongMarks).toBe(-1)
      expect(result.data.totalTime).toBe(60)
    }
  })

  it('rejects an empty totalTime (as submitted by an untouched number input)', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, totalTime: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-positive totalMarks', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, totalMarks: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a non-integer totalQuestions', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, totalQuestions: 12.5 })
    expect(result.success).toBe(false)
  })

  it('allows negative wrongMarks (negative marking is the documented convention)', () => {
    const result = testMetadataSchema.safeParse({ ...validInput, wrongMarks: -2 })
    expect(result.success).toBe(true)
  })
})
