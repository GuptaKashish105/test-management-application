import { useSubjects } from '@features/subjects'
import { useTopics } from '@features/topics'
import type { TestDetail } from '@services/tests'
import type { Topic } from '@services/topics'
import { useMemo } from 'react'

/**
 * Resolves a test's subject/topic *names* (as returned by `GET /tests/:id`)
 * back to ids by cross-referencing `GET /subjects` and
 * `GET /topics/subject/:id` — shared by the Edit Test form (full metadata
 * resolution) and Add Questions (scoping per-question Topic options to the
 * test's own topics), so this logic lives in exactly one place.
 */
export function useResolvedTestTopics(test: TestDetail | undefined) {
  const subjectsQuery = useSubjects()

  const subjectId = useMemo(() => {
    if (!test || !subjectsQuery.data) return null
    return subjectsQuery.data.find((subject) => subject.name === test.subjectName)?.id ?? null
  }, [test, subjectsQuery.data])

  const topicsQuery = useTopics(subjectId)

  const topics: Topic[] = useMemo(() => {
    if (!test || !topicsQuery.data) return []
    const names = new Set(test.topicNames)
    return topicsQuery.data.filter((topic) => names.has(topic.name))
  }, [test, topicsQuery.data])

  return {
    subjectId,
    topics,
    hasLoadedTopics: topicsQuery.data !== undefined,
    subjectResolved: subjectsQuery.data ? subjectId !== null : true,
    isLoading: subjectsQuery.isLoading || (subjectId !== null && topicsQuery.isLoading),
    isError: subjectsQuery.isError || topicsQuery.isError,
    errorMessage: subjectsQuery.error?.message ?? topicsQuery.error?.message ?? null,
  }
}
