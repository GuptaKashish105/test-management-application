import { describe, expect, it } from 'vitest'

import { EMPTY_QUESTION_FORM_VALUES, isQuestionComplete, questionSchema } from './questionSchema'

const validInput = {
  question: 'What is 2 + 2?',
  option1: '3',
  option2: '4',
  option3: '5',
  option4: '6',
  correctOption: 'option2',
  explanation: 'Basic addition',
  difficulty: 'easy',
  topicId: '',
  subTopicId: '',
  mediaUrl: '',
}

describe('questionSchema', () => {
  it('accepts a fully valid question', () => {
    const result = questionSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('requires question text', () => {
    const result = questionSchema.safeParse({ ...validInput, question: '  ' })
    expect(result.success).toBe(false)
  })

  it('requires all 4 options to be non-empty', () => {
    const result = questionSchema.safeParse({ ...validInput, option3: '' })
    expect(result.success).toBe(false)
  })

  it('requires a correct option to be selected', () => {
    const result = questionSchema.safeParse({ ...validInput, correctOption: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a correctOption outside option1-4', () => {
    const result = questionSchema.safeParse({ ...validInput, correctOption: 'option5' })
    expect(result.success).toBe(false)
  })

  it('allows empty explanation/difficulty/topic/sub-topic/media URL (all optional)', () => {
    const result = questionSchema.safeParse({
      ...validInput,
      explanation: '',
      difficulty: '',
      topicId: '',
      subTopicId: '',
      mediaUrl: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a non-empty media URL that is not a valid URL', () => {
    const result = questionSchema.safeParse({ ...validInput, mediaUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('accepts a valid media URL', () => {
    const result = questionSchema.safeParse({ ...validInput, mediaUrl: 'https://example.com/image.png' })
    expect(result.success).toBe(true)
  })
})

describe('isQuestionComplete', () => {
  it('is false for a brand-new blank question', () => {
    expect(isQuestionComplete(EMPTY_QUESTION_FORM_VALUES)).toBe(false)
  })

  it('is true once all required fields are filled', () => {
    expect(isQuestionComplete(validInput)).toBe(true)
  })
})
