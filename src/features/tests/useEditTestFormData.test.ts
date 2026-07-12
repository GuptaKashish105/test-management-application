import { describe, expect, it } from 'vitest'

import { computeUnresolvedWarnings } from './useEditTestFormData'

describe('computeUnresolvedWarnings', () => {
  it('returns no warnings when everything resolves cleanly', () => {
    const warnings = computeUnresolvedWarnings({
      subjectName: 'Mathematics',
      subjectResolved: true,
      topicNames: ['Algebra'],
      topicsResolvedCount: 1,
      subTopicNames: ['Linear Equations'],
      subTopicsResolvedCount: 1,
      type: 'chapterwise',
    })
    expect(warnings).toEqual([])
  })

  it('warns when the subject name could not be matched to a subject id', () => {
    const warnings = computeUnresolvedWarnings({
      subjectName: 'Unknown Subject',
      subjectResolved: false,
      topicNames: [],
      topicsResolvedCount: 0,
      subTopicNames: [],
      subTopicsResolvedCount: 0,
      type: null,
    })
    expect(warnings).toEqual([
      'Could not match subject "Unknown Subject" to a known subject — please reselect it.',
    ])
  })

  it('warns when fewer topics resolve than were returned by the API', () => {
    const warnings = computeUnresolvedWarnings({
      subjectName: 'Mathematics',
      subjectResolved: true,
      topicNames: ['Algebra', 'Geometry'],
      topicsResolvedCount: 1,
      subTopicNames: [],
      subTopicsResolvedCount: 0,
      type: 'chapterwise',
    })
    expect(warnings).toEqual([
      'Some topics could not be matched — please review the Topic selection.',
    ])
  })

  it('warns when fewer sub-topics resolve than were returned by the API', () => {
    const warnings = computeUnresolvedWarnings({
      subjectName: 'Mathematics',
      subjectResolved: true,
      topicNames: ['Algebra'],
      topicsResolvedCount: 1,
      subTopicNames: ['Linear Equations', 'Quadratics'],
      subTopicsResolvedCount: 1,
      type: 'chapterwise',
    })
    expect(warnings).toEqual([
      'Some sub-topics could not be matched — please review the Sub Topic selection.',
    ])
  })

  it('warns when the test type is not the only supported one', () => {
    const warnings = computeUnresolvedWarnings({
      subjectName: 'Mathematics',
      subjectResolved: true,
      topicNames: [],
      topicsResolvedCount: 0,
      subTopicNames: [],
      subTopicsResolvedCount: 0,
      type: 'pyq',
    })
    expect(warnings).toEqual([
      'This test\'s type ("pyq") isn\'t fully supported by this form yet — only chapterwise tests can be edited here.',
    ])
  })

  it('accumulates multiple warnings at once', () => {
    const warnings = computeUnresolvedWarnings({
      subjectName: 'Unknown',
      subjectResolved: false,
      topicNames: ['Algebra'],
      topicsResolvedCount: 0,
      subTopicNames: [],
      subTopicsResolvedCount: 0,
      type: null,
    })
    expect(warnings).toHaveLength(2)
  })
})
