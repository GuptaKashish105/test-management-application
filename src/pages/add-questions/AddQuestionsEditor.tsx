import { paths } from '@app/router/paths'
import { WizardLayout } from '@components/layout'
import { Alert, Breadcrumb, Button } from '@components/ui'
import type { QuestionFormInput, QuestionRecord } from '@features/questions'
import {
  createBlankQuestionRecord,
  createQuestionRecordFromInput,
  isQuestionComplete,
  parseQuestionsCsv,
  QuestionEditorForm,
  useSaveQuestions,
} from '@features/questions'
import { EditTestModal, TestSummaryHeader } from '@features/tests'
import type { TestDetail } from '@services/tests'
import type { Topic } from '@services/topics'
import type { ChangeEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { QuestionSidebar } from './QuestionSidebar'

export interface AddQuestionsEditorProps {
  testId: string
  test: TestDetail
  topics: Topic[]
  isLoadingTopics: boolean
  initialQuestions: QuestionRecord[]
}

export function AddQuestionsEditor({
  testId,
  test,
  topics,
  isLoadingTopics,
  initialQuestions,
}: AddQuestionsEditorProps) {
  const navigate = useNavigate()
  const saveQuestions = useSaveQuestions()
  const csvInputRef = useRef<HTMLInputElement>(null)

  const [questions, setQuestions] = useState<QuestionRecord[]>(initialQuestions)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    initialQuestions[0]?.clientId ?? null,
  )
  const [isEditingTest, setIsEditingTest] = useState(false)
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [csvImportedCount, setCsvImportedCount] = useState<number | null>(null)

  const handleChange = useCallback(
    (values: QuestionFormInput) => {
      if (!selectedClientId) return
      setQuestions((prev) =>
        prev.map((q) => (q.clientId === selectedClientId ? { ...q, ...values } : q)),
      )
    },
    [selectedClientId],
  )

  const handleAdd = () => {
    const blank = createBlankQuestionRecord()
    setQuestions((prev) => [...prev, blank])
    setSelectedClientId(blank.clientId)
  }

  const handleDelete = (clientId: string) => {
    setQuestions((prev) => {
      const next = prev.filter((q) => q.clientId !== clientId)
      if (selectedClientId === clientId) {
        setSelectedClientId(next[0]?.clientId ?? null)
      }
      return next
    })
  }

  const handleCsvFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const text = await file.text()
    const { records, errors } = parseQuestionsCsv(text)
    setCsvErrors(errors)
    setCsvImportedCount(records.length)

    if (records.length === 0) return

    const imported = records.map(createQuestionRecordFromInput)
    setQuestions((prev) => [...prev, ...imported])
    setSelectedClientId(imported[0].clientId)
  }

  const selectedIndex = questions.findIndex((q) => q.clientId === selectedClientId)
  const selectedRecord = selectedIndex >= 0 ? questions[selectedIndex] : null
  const incompleteDraftCount = questions.filter(
    (q) => q.status === 'draft' && !isQuestionComplete(q),
  ).length
  const canSaveAndContinue = questions.length > 0 && incompleteDraftCount === 0

  const handleSaveAndContinue = () => {
    const draftQuestions = questions.filter((q) => q.status === 'draft')
    const existingPersistedIds = questions
      .filter((q) => q.status === 'saved' && q.persistedId)
      .map((q) => q.persistedId as string)

    saveQuestions.mutate(
      {
        testId,
        draftQuestions,
        existingPersistedIds,
        totalQuestionCount: questions.length,
        correctMarksPerQuestion: test.correctMarks ?? 0,
      },
      { onSuccess: () => navigate(paths.previewPublish(testId)) },
    )
  }

  const csvUploadInput = (
    <input
      ref={csvInputRef}
      type="file"
      accept=".csv,text/csv"
      aria-label="Upload CSV file"
      className="hidden"
      onChange={handleCsvFileSelected}
    />
  )

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3">
        <Breadcrumb items={['Test Creation', 'Create Test', 'Chapter Wise']} />
      </div>
      <WizardLayout
        sidebar={
          <QuestionSidebar
            questions={questions}
            selectedClientId={selectedClientId}
            onSelect={setSelectedClientId}
            onDelete={handleDelete}
          />
        }
        header={<TestSummaryHeader test={test} onEdit={() => setIsEditingTest(true)} />}
        footer={
          <div className="flex w-full items-center justify-between gap-4">
            <div className="text-sm text-neutral-500">
              {questions.length === 0 && 'Add at least 1 question to continue.'}
              {questions.length > 0 &&
                incompleteDraftCount > 0 &&
                `${incompleteDraftCount} question(s) still need required fields filled.`}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="danger" onClick={() => setIsEditingTest(true)}>
                Edit Test Creation
              </Button>
              <Button
                type="button"
                onClick={handleSaveAndContinue}
                disabled={!canSaveAndContinue}
                isLoading={saveQuestions.isPending}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        }
      >
        {saveQuestions.error && (
          <Alert tone="danger" className="mb-4">
            {saveQuestions.error.message}
          </Alert>
        )}

        {csvImportedCount !== null && (
          <Alert tone={csvErrors.length > 0 ? 'warning' : 'success'} className="mb-4">
            <p>
              Imported {csvImportedCount} question{csvImportedCount === 1 ? '' : 's'} from CSV.
            </p>
            {csvErrors.length > 0 && (
              <ul className="mt-2 list-disc pl-4">
                {csvErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </Alert>
        )}

        {selectedRecord ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">
                Question {selectedIndex + 1}
              </h2>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                  Add Another Question
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => csvInputRef.current?.click()}
                >
                  Upload CSV
                </Button>
                {csvUploadInput}
              </div>
            </div>
            <QuestionEditorForm
              key={selectedRecord.clientId}
              record={selectedRecord}
              topics={topics}
              isLoadingTopics={isLoadingTopics}
              onChange={handleChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-neutral-500">
            <p>No questions yet.</p>
            <div className="flex gap-2">
              <Button type="button" onClick={handleAdd}>
                Add Another Question
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => csvInputRef.current?.click()}
              >
                Upload CSV
              </Button>
              {csvUploadInput}
            </div>
          </div>
        )}
      </WizardLayout>

      <EditTestModal
        testId={isEditingTest ? testId : null}
        onClose={() => setIsEditingTest(false)}
      />
    </div>
  )
}
