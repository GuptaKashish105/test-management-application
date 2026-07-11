import { Alert, Button, Input, MultiSelect, RadioGroup, Select } from '@components/ui'
import { useSubjects } from '@features/subjects'
import { useSubTopics } from '@features/subTopics'
import { useTopics } from '@features/topics'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import type { TestMetadataFormInput, TestMetadataFormValues } from './testMetadataSchema'
import { DIFFICULTY_OPTIONS, testMetadataSchema } from './testMetadataSchema'
import { TestTypeTabs } from './TestTypeTabs'

export interface TestMetadataFormProps {
  defaultValues: TestMetadataFormInput
  onSubmit: (values: TestMetadataFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  submitLabel: string
  submitError?: string | null
}

export function TestMetadataForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submitError,
}: TestMetadataFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestMetadataFormInput, unknown, TestMetadataFormValues>({
    resolver: zodResolver(testMetadataSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const subjectId = watch('subject')
  const topicIds = watch('topics')

  const { data: subjects, isLoading: isLoadingSubjects, isError: isSubjectsError } = useSubjects()
  const { data: topics, isLoading: isLoadingTopics } = useTopics(subjectId || null)
  const { data: subTopics, isLoading: isLoadingSubTopics } = useSubTopics(topicIds)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <TestTypeTabs value={watch('type')} />

      {isSubjectsError && (
        <Alert tone="danger">Failed to load subjects. Reload the page to try again.</Alert>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Select
          label="Subject"
          placeholder={isLoadingSubjects ? 'Loading…' : 'Choose from Drop-down'}
          disabled={isLoadingSubjects}
          options={(subjects ?? []).map((subject) => ({ value: subject.id, label: subject.name }))}
          error={errors.subject?.message}
          {...register('subject', {
            onChange: () => {
              setValue('topics', [])
              setValue('subTopics', [])
            },
          })}
        />

        <Input
          label="Name of Test"
          placeholder="Enter name of Test"
          error={errors.name?.message}
          {...register('name')}
        />

        <Controller
          control={control}
          name="topics"
          render={({ field }) => (
            <MultiSelect
              label="Topic"
              placeholder={
                !subjectId ? 'Choose a subject first' : isLoadingTopics ? 'Loading…' : undefined
              }
              disabled={!subjectId || isLoadingTopics}
              options={(topics ?? []).map((topic) => ({ value: topic.id, label: topic.name }))}
              value={field.value}
              onChange={(values) => {
                field.onChange(values)
                setValue('subTopics', [])
              }}
              error={errors.topics?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="subTopics"
          render={({ field }) => (
            <MultiSelect
              label="Sub Topic"
              placeholder={
                topicIds.length === 0
                  ? 'Choose a topic first'
                  : isLoadingSubTopics
                    ? 'Loading…'
                    : undefined
              }
              disabled={topicIds.length === 0 || isLoadingSubTopics}
              options={(subTopics ?? []).map((subTopic) => ({
                value: subTopic.id,
                label: subTopic.name,
              }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.subTopics?.message}
            />
          )}
        />

        <Input
          label="Duration (Minutes)"
          type="number"
          placeholder="Enter the time"
          error={errors.totalTime?.message}
          {...register('totalTime')}
        />

        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <RadioGroup
              name="difficulty"
              legend="Test Difficulty Level"
              options={[...DIFFICULTY_OPTIONS]}
              value={field.value}
              onChange={field.onChange}
              error={errors.difficulty?.message}
            />
          )}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-800">Marking Scheme:</p>
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Input
            label="Wrong Answer"
            type="number"
            error={errors.wrongMarks?.message}
            {...register('wrongMarks')}
          />
          <Input
            label="Unattempted"
            type="number"
            error={errors.unattemptMarks?.message}
            {...register('unattemptMarks')}
          />
          <Input
            label="Correct Answer"
            type="number"
            error={errors.correctMarks?.message}
            {...register('correctMarks')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="No of Questions"
          type="number"
          placeholder="Ex:250 Marks"
          error={errors.totalQuestions?.message}
          {...register('totalQuestions')}
        />
        <Input
          label="Total Marks"
          type="number"
          placeholder="Ex:250 Marks"
          error={errors.totalMarks?.message}
          {...register('totalMarks')}
        />
      </div>

      {submitError && <Alert tone="danger">{submitError}</Alert>}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
