import { useSubTopics } from '@features/subTopics'
import { useMemo } from 'react'

import type { TestMetadataFormInput } from './testMetadataSchema'
import { useResolvedTestTopics } from './useResolvedTestTopics'
import { useTest } from './useTest'

/**
 * `GET /tests/:id` returns subject/topics/sub-topics as display *names*, but
 * the edit form (and `PUT /tests/:id`) needs *ids*. Subject/topic resolution
 * is shared with Add Questions via useResolvedTestTopics; this hook adds the
 * sub-topic resolution and full form-defaultValues shaping that only the
 * edit form needs. Anything that can't be matched is surfaced as a warning
 * instead of silently dropped or guessed.
 */
export function useEditTestFormData(testId: string) {
  const testQuery = useTest(testId)
  const {
    subjectId,
    topics,
    hasLoadedTopics,
    subjectResolved,
    isLoading: isLoadingTopics,
    isError: isTopicsError,
    errorMessage: topicsErrorMessage,
  } = useResolvedTestTopics(testQuery.data)

  const topicIds = useMemo(() => topics.map((topic) => topic.id), [topics])

  const subTopicsQuery = useSubTopics(topicIds)

  const subTopicIds = useMemo(() => {
    if (!testQuery.data || !subTopicsQuery.data) return []
    const names = new Set(testQuery.data.subTopicNames)
    return subTopicsQuery.data.filter((st) => names.has(st.name)).map((st) => st.id)
  }, [testQuery.data, subTopicsQuery.data])

  const warnings = useMemo(() => {
    if (!testQuery.data) return []
    return computeUnresolvedWarnings({
      subjectName: testQuery.data.subjectName,
      subjectResolved,
      topicNames: testQuery.data.topicNames,
      topicsResolvedCount: hasLoadedTopics ? topicIds.length : testQuery.data.topicNames.length,
      subTopicNames: testQuery.data.subTopicNames,
      subTopicsResolvedCount: subTopicsQuery.data
        ? subTopicIds.length
        : testQuery.data.subTopicNames.length,
      type: testQuery.data.type,
    })
  }, [testQuery.data, subjectResolved, hasLoadedTopics, topicIds, subTopicsQuery.data, subTopicIds])

  const isLoading =
    testQuery.isLoading || isLoadingTopics || (topicIds.length > 0 && subTopicsQuery.isLoading)

  const isError = testQuery.isError || isTopicsError || subTopicsQuery.isError
  const errorMessage = testQuery.error?.message ?? topicsErrorMessage ?? subTopicsQuery.error?.message ?? null

  const defaultValues: TestMetadataFormInput | null = testQuery.data
    ? {
        name: testQuery.data.name,
        type: 'chapterwise',
        subject: subjectId ?? '',
        topics: topicIds,
        subTopics: subTopicIds,
        difficulty: testQuery.data.difficulty ?? '',
        correctMarks: testQuery.data.correctMarks ?? 0,
        wrongMarks: testQuery.data.wrongMarks ?? 0,
        unattemptMarks: testQuery.data.unattemptMarks ?? 0,
        totalTime: testQuery.data.totalTime ?? '',
        totalMarks: testQuery.data.totalMarks ?? '',
        totalQuestions: testQuery.data.totalQuestions ?? '',
      }
    : null

  return { isLoading, isError, errorMessage, defaultValues, warnings }
}

interface WarningInputs {
  subjectName: string
  subjectResolved: boolean
  topicNames: string[]
  topicsResolvedCount: number
  subTopicNames: string[]
  subTopicsResolvedCount: number
  type: string | null
}

export function computeUnresolvedWarnings(input: WarningInputs): string[] {
  const warnings: string[] = []

  if (!input.subjectResolved) {
    warnings.push(`Could not match subject "${input.subjectName}" to a known subject — please reselect it.`)
  }
  if (input.topicNames.length > 0 && input.topicsResolvedCount < input.topicNames.length) {
    warnings.push('Some topics could not be matched — please review the Topic selection.')
  }
  if (input.subTopicNames.length > 0 && input.subTopicsResolvedCount < input.subTopicNames.length) {
    warnings.push('Some sub-topics could not be matched — please review the Sub Topic selection.')
  }
  if (input.type !== null && input.type !== 'chapterwise') {
    warnings.push(
      `This test's type ("${input.type}") isn't fully supported by this form yet — only chapterwise tests can be edited here.`,
    )
  }

  return warnings
}
