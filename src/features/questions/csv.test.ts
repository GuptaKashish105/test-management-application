import { describe, expect, it } from 'vitest'

import { parseQuestionsCsv } from './csv'

const HEADER = 'question,option1,option2,option3,option4,correct_option,explanation,difficulty'

describe('parseQuestionsCsv', () => {
  it('parses a well-formed CSV into draft questions', () => {
    const csv = [
      HEADER,
      'What is 2 + 2?,3,4,5,6,option2,Basic addition,easy',
      'What is the capital of France?,London,Paris,Berlin,Rome,option2,,medium',
    ].join('\n')

    const { records, errors } = parseQuestionsCsv(csv)

    expect(errors).toEqual([])
    expect(records).toHaveLength(2)
    expect(records[0].question).toBe('What is 2 + 2?')
    expect(records[0].correctOption).toBe('option2')
    expect(records[0].difficulty).toBe('easy')
    expect(records[1].explanation).toBe('')
  })

  it('handles quoted fields containing commas', () => {
    const csv = [HEADER, '"What is 1, plus 1?",1,2,3,4,option2,,'].join('\n')

    const { records, errors } = parseQuestionsCsv(csv)

    expect(errors).toEqual([])
    expect(records[0].question).toBe('What is 1, plus 1?')
  })

  it('reports a missing-column error and imports nothing when required columns are absent', () => {
    const csv = ['question,option1,option2', 'Only three columns,a,b'].join('\n')

    const { records, errors } = parseQuestionsCsv(csv)

    expect(records).toEqual([])
    expect(errors[0]).toContain('Missing required column')
  })

  it('skips invalid rows but still imports the valid ones, reporting the row number', () => {
    const csv = [
      HEADER,
      'Valid question?,1,2,3,4,option1,,',
      ',1,2,3,4,option1,,', // missing question text
      'Another valid one?,1,2,3,4,option5,,', // invalid correct_option
    ].join('\n')

    const { records, errors } = parseQuestionsCsv(csv)

    expect(records).toHaveLength(1)
    expect(records[0].question).toBe('Valid question?')
    expect(errors).toHaveLength(2)
    expect(errors[0]).toContain('Row 3')
    expect(errors[1]).toContain('Row 4')
  })

  it('HTML-escapes question text so it renders safely as rich text later', () => {
    const csv = [HEADER, '<b>bold</b> & unsafe,1,2,3,4,option1,,'].join('\n')

    const { records } = parseQuestionsCsv(csv)

    expect(records[0].question).toBe('&lt;b&gt;bold&lt;/b&gt; &amp; unsafe')
  })

  it('returns an error for an empty file', () => {
    const { records, errors } = parseQuestionsCsv('')
    expect(records).toEqual([])
    expect(errors).toEqual(['The CSV file is empty.'])
  })
})
