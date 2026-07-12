/**
 * In-memory mock backend for Demo Mode. Stores tests/questions the same way
 * the real API implies (subject/topics/sub-topics as ids), so create/update
 * round-trip exactly like the real `PUT /tests/:id` contract, while list/detail
 * reads resolve those ids to display names — matching `normalizeTest`'s
 * documented id-vs-name split. Never imported outside `./demoApiRequest`.
 */

interface MockSubject {
  id: string
  name: string
}

interface MockTopic {
  id: string
  name: string
  subjectId: string
}

interface MockSubTopic {
  id: string
  name: string
  topicId: string
}

interface MockQuestion {
  id: string
  type: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correctOption: string
  explanation?: string
  difficulty?: string
  testId: string
}

interface MockTest {
  id: string
  name: string
  subjectId: string
  topicIds: string[]
  subTopicIds: string[]
  type: string
  correctMarks: number
  wrongMarks: number
  unattemptMarks: number
  difficulty: string
  totalTime: number
  totalMarks: number
  totalQuestions: number
  status: string | null
  createdAt: string
  questionIds: string[]
}

function seedSubjects(): MockSubject[] {
  return [
    { id: 'subject-mathematics', name: 'Mathematics' },
    { id: 'subject-physics', name: 'Physics' },
    { id: 'subject-english', name: 'English' },
  ]
}

function seedTopics(): MockTopic[] {
  return [
    { id: 'topic-algebra', name: 'Algebra', subjectId: 'subject-mathematics' },
    { id: 'topic-geometry', name: 'Geometry', subjectId: 'subject-mathematics' },
    { id: 'topic-mechanics', name: 'Mechanics', subjectId: 'subject-physics' },
    { id: 'topic-optics', name: 'Optics', subjectId: 'subject-physics' },
    { id: 'topic-grammar', name: 'Grammar', subjectId: 'subject-english' },
    { id: 'topic-writing', name: 'Writing', subjectId: 'subject-english' },
  ]
}

function seedSubTopics(): MockSubTopic[] {
  return [
    { id: 'subtopic-linear-equations', name: 'Linear Equations', topicId: 'topic-algebra' },
    { id: 'subtopic-quadratics', name: 'Quadratics', topicId: 'topic-algebra' },
    { id: 'subtopic-triangles', name: 'Triangles', topicId: 'topic-geometry' },
    { id: 'subtopic-newtons-laws', name: "Newton's Laws", topicId: 'topic-mechanics' },
    { id: 'subtopic-refraction', name: 'Refraction', topicId: 'topic-optics' },
    { id: 'subtopic-tenses', name: 'Tenses', topicId: 'topic-grammar' },
    { id: 'subtopic-application', name: 'Application', topicId: 'topic-writing' },
  ]
}

function seedQuestions(): MockQuestion[] {
  return [
    {
      id: 'question-english-1',
      type: 'mcq',
      question: 'Choose the correct subject noun: "___ jumps over the fence."',
      option1: 'The fox',
      option2: 'Jumps',
      option3: 'Fence',
      option4: 'The',
      correctOption: 'option1',
      explanation: '"Fox" is the subject noun of the sentence.',
      difficulty: 'easy',
      testId: 'test-english-grammar',
    },
    {
      id: 'question-english-2',
      type: 'mcq',
      question: 'Choose the correctly punctuated sentence.',
      option1: 'Its a great day.',
      option2: "It's a great day.",
      option3: 'Its a great day',
      option4: "Its' a great day.",
      correctOption: 'option2',
      explanation: '"It\'s" is the contraction of "it is".',
      difficulty: 'easy',
      testId: 'test-english-grammar',
    },
    {
      id: 'question-english-3',
      type: 'mcq',
      question: 'Which sentence uses the past tense correctly?',
      option1: 'She go to school yesterday.',
      option2: 'She goes to school yesterday.',
      option3: 'She went to school yesterday.',
      option4: 'She going to school yesterday.',
      correctOption: 'option3',
      explanation: '"Went" is the simple past tense of "go".',
      difficulty: 'medium',
      testId: 'test-english-grammar',
    },
    {
      id: 'question-english-4',
      type: 'mcq',
      question: 'Identify the adjective in: "The tall boy ran quickly."',
      option1: 'Boy',
      option2: 'Tall',
      option3: 'Ran',
      option4: 'Quickly',
      correctOption: 'option2',
      explanation: '"Tall" describes the noun "boy".',
      difficulty: 'easy',
      testId: 'test-english-grammar',
    },
    {
      id: 'question-english-5',
      type: 'mcq',
      question: 'Choose the correctly spelled word.',
      option1: 'Recieve',
      option2: 'Receive',
      option3: 'Receeve',
      option4: 'Receve',
      correctOption: 'option2',
      explanation: '"i" before "e" except after "c" — "receive" is correct.',
      difficulty: 'medium',
      testId: 'test-english-grammar',
    },
  ]
}

function seedTests(): MockTest[] {
  return [
    {
      id: 'test-english-grammar',
      name: 'Chapter 1 - English Grammar Test',
      subjectId: 'subject-english',
      topicIds: ['topic-grammar', 'topic-writing'],
      subTopicIds: ['subtopic-application'],
      type: 'chapterwise',
      correctMarks: 4,
      wrongMarks: -1,
      unattemptMarks: 0,
      difficulty: 'easy',
      totalTime: 60,
      totalMarks: 20,
      totalQuestions: 5,
      status: 'live',
      createdAt: '2026-07-06T09:00:00.000Z',
      questionIds: [
        'question-english-1',
        'question-english-2',
        'question-english-3',
        'question-english-4',
        'question-english-5',
      ],
    },
    {
      id: 'test-algebra-basics',
      name: 'Algebra Basics',
      subjectId: 'subject-mathematics',
      topicIds: ['topic-algebra'],
      subTopicIds: ['subtopic-linear-equations'],
      type: 'chapterwise',
      correctMarks: 4,
      wrongMarks: -1,
      unattemptMarks: 0,
      difficulty: 'medium',
      totalTime: 45,
      totalMarks: 40,
      totalQuestions: 10,
      status: 'draft',
      createdAt: '2026-07-10T09:00:00.000Z',
      questionIds: [],
    },
    {
      id: 'test-physics-mechanics',
      name: 'Physics Mechanics Quiz',
      subjectId: 'subject-physics',
      topicIds: ['topic-mechanics'],
      subTopicIds: ['subtopic-newtons-laws'],
      type: 'chapterwise',
      correctMarks: 5,
      wrongMarks: -2,
      unattemptMarks: 0,
      difficulty: 'difficult',
      totalTime: 30,
      totalMarks: 25,
      totalQuestions: 5,
      status: 'draft',
      createdAt: '2026-07-12T09:00:00.000Z',
      questionIds: [],
    },
  ]
}

interface RawTestListItem {
  id: string
  name: string
  subject: string
  topics: string[]
  status: string | null
  created_at: string
}

interface RawTestDetail {
  id: string
  name: string
  subject: string
  topics: string[]
  questions: string[]
  sub_topics: string[]
  type: string
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: string
  total_time: number
  total_marks: number
  total_questions: number
  status: string | null
  created_at: string
}

interface RawQuestion {
  id: string
  type: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: string
  explanation?: string
  difficulty?: string
  test_id: string
}

interface CreateQuestionPayload {
  type: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: string
  explanation?: string
  difficulty?: string
  test_id: string
}

export class DemoNotFoundError extends Error {}

/** Fresh, isolated database instance — used both by the app singleton and by tests. */
export function createMockDatabase() {
  const subjects = seedSubjects()
  const topics = seedTopics()
  const subTopics = seedSubTopics()
  let tests = seedTests()
  let questions = seedQuestions()

  function findSubjectName(id: string): string {
    return subjects.find((subject) => subject.id === id)?.name ?? ''
  }

  function findTopicNames(ids: string[]): string[] {
    return topics.filter((topic) => ids.includes(topic.id)).map((topic) => topic.name)
  }

  function findSubTopicNames(ids: string[]): string[] {
    return subTopics
      .filter((subTopic) => ids.includes(subTopic.id))
      .map((subTopic) => subTopic.name)
  }

  function toListItem(test: MockTest): RawTestListItem {
    return {
      id: test.id,
      name: test.name,
      subject: findSubjectName(test.subjectId),
      topics: findTopicNames(test.topicIds),
      status: test.status,
      created_at: test.createdAt,
    }
  }

  function toDetail(test: MockTest): RawTestDetail {
    return {
      id: test.id,
      name: test.name,
      subject: findSubjectName(test.subjectId),
      topics: findTopicNames(test.topicIds),
      questions: test.questionIds,
      sub_topics: findSubTopicNames(test.subTopicIds),
      type: test.type,
      correct_marks: test.correctMarks,
      wrong_marks: test.wrongMarks,
      unattempt_marks: test.unattemptMarks,
      difficulty: test.difficulty,
      total_time: test.totalTime,
      total_marks: test.totalMarks,
      total_questions: test.totalQuestions,
      status: test.status,
      created_at: test.createdAt,
    }
  }

  function toRawQuestion(question: MockQuestion): RawQuestion {
    return {
      id: question.id,
      type: question.type,
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correct_option: question.correctOption,
      explanation: question.explanation,
      difficulty: question.difficulty,
      test_id: question.testId,
    }
  }

  return {
    login(userId: string): { token: string; user: { id: string; name: string } } {
      return { token: `demo-token-${userId}`, user: { id: userId, name: userId } }
    },

    getSubjects(): MockSubject[] {
      return subjects
    },

    getTopicsBySubject(subjectId: string): MockTopic[] {
      return topics.filter((topic) => topic.subjectId === subjectId)
    },

    getSubTopicsByTopics(topicIds: string[]): MockSubTopic[] {
      return subTopics.filter((subTopic) => topicIds.includes(subTopic.topicId))
    },

    listTests(): RawTestListItem[] {
      return tests.map(toListItem)
    },

    getTest(id: string): RawTestDetail {
      const test = tests.find((item) => item.id === id)
      if (!test) {
        throw new DemoNotFoundError(`No mock test with id "${id}"`)
      }
      return toDetail(test)
    },

    createTest(payload: Record<string, unknown>): { id: string; name: string } {
      const name = String(payload.name ?? '')
      const test: MockTest = {
        id: crypto.randomUUID(),
        name,
        subjectId: String(payload.subject ?? ''),
        topicIds: Array.isArray(payload.topics) ? (payload.topics as string[]) : [],
        subTopicIds: Array.isArray(payload.sub_topics) ? (payload.sub_topics as string[]) : [],
        type: String(payload.type ?? 'chapterwise'),
        correctMarks: Number(payload.correct_marks ?? 0),
        wrongMarks: Number(payload.wrong_marks ?? 0),
        unattemptMarks: Number(payload.unattempt_marks ?? 0),
        difficulty: String(payload.difficulty ?? ''),
        totalTime: Number(payload.total_time ?? 0),
        totalMarks: Number(payload.total_marks ?? 0),
        totalQuestions: Number(payload.total_questions ?? 0),
        status: null,
        createdAt: new Date().toISOString(),
        questionIds: [],
      }
      tests = [...tests, test]
      return { id: test.id, name: test.name }
    },

    updateTest(id: string, payload: Record<string, unknown>): void {
      const test = tests.find((item) => item.id === id)
      if (!test) {
        throw new DemoNotFoundError(`No mock test with id "${id}"`)
      }
      if (typeof payload.name === 'string') test.name = payload.name
      if (typeof payload.type === 'string') test.type = payload.type
      if (typeof payload.subject === 'string') test.subjectId = payload.subject
      if (Array.isArray(payload.topics)) test.topicIds = payload.topics as string[]
      if (Array.isArray(payload.sub_topics)) test.subTopicIds = payload.sub_topics as string[]
      if (typeof payload.correct_marks === 'number') test.correctMarks = payload.correct_marks
      if (typeof payload.wrong_marks === 'number') test.wrongMarks = payload.wrong_marks
      if (typeof payload.unattempt_marks === 'number') test.unattemptMarks = payload.unattempt_marks
      if (typeof payload.difficulty === 'string') test.difficulty = payload.difficulty
      if (typeof payload.total_time === 'number') test.totalTime = payload.total_time
      if (typeof payload.total_marks === 'number') test.totalMarks = payload.total_marks
      if (typeof payload.total_questions === 'number') test.totalQuestions = payload.total_questions
      if (Array.isArray(payload.questions)) test.questionIds = payload.questions as string[]
      if (typeof payload.status === 'string') test.status = payload.status
    },

    createQuestions(payloads: CreateQuestionPayload[]): { id: string }[] {
      const created = payloads.map((payload) => {
        const question: MockQuestion = {
          id: crypto.randomUUID(),
          type: payload.type,
          question: payload.question,
          option1: payload.option1,
          option2: payload.option2,
          option3: payload.option3,
          option4: payload.option4,
          correctOption: payload.correct_option,
          explanation: payload.explanation,
          difficulty: payload.difficulty,
          testId: payload.test_id,
        }
        return question
      })
      questions = [...questions, ...created]
      return created.map((question) => ({ id: question.id }))
    },

    getQuestions(ids: string[]): RawQuestion[] {
      const byId = new Map(questions.map((question) => [question.id, question]))
      return ids
        .map((id) => byId.get(id))
        .filter((question): question is MockQuestion => question !== undefined)
        .map(toRawQuestion)
    },
  }
}

export const mockDb = createMockDatabase()
