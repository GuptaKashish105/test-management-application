import { Alert, Button, Input, RichTextEditor, Select, Textarea } from '@components/ui'
import { useSubTopics } from '@features/subTopics'
import { DIFFICULTY_OPTIONS } from '@features/tests'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Topic } from '@services/topics'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { QuestionRecord } from './questionRecord'
import type { QuestionFormInput } from './questionSchema'
import { questionSchema } from './questionSchema'

export interface QuestionEditorFormProps {
  record: QuestionRecord
  topics: Topic[]
  isLoadingTopics: boolean
  /** Fires on every field change, so the parent's question list always reflects the live edits. */
  onChange: (values: QuestionFormInput) => void
}

const OPTION_FIELDS = [
  { name: 'option1' as const, label: 'Option 1' },
  { name: 'option2' as const, label: 'Option 2' },
  { name: 'option3' as const, label: 'Option 3' },
  { name: 'option4' as const, label: 'Option 4' },
]

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

/** Keyed by the caller on `record.clientId` so switching the selected question remounts cleanly. */
export function QuestionEditorForm({
  record,
  topics,
  isLoadingTopics,
  onChange,
}: QuestionEditorFormProps) {
  const readOnly = record.status === 'saved'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: record,
    mode: 'onBlur',
  })

  useEffect(() => {
    const subscription = watch((values) => onChange(values as QuestionFormInput))
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  const topicId = watch('topicId')
  const mediaUrl = watch('mediaUrl')
  const { data: subTopics, isLoading: isLoadingSubTopics } = useSubTopics(topicId ? [topicId] : [])

  const handleImageSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image must be smaller than 2MB.')
      return
    }

    setImageError(null)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setValue('mediaUrl', reader.result, { shouldValidate: true, shouldDirty: true })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-5">
      {readOnly && (
        <Alert tone="brand">
          This question is already saved. Editing existing questions isn&apos;t available yet — no
          update endpoint is documented for individual questions.
        </Alert>
      )}

      <Controller
        control={control}
        name="question"
        render={({ field }) => (
          <RichTextEditor
            label="Question"
            placeholder="Type here"
            disabled={readOnly}
            error={errors.question?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTION_FIELDS.map((option) => (
          <div key={option.name} className="flex items-center gap-2">
            <input
              type="radio"
              aria-label={`${option.label} is correct`}
              disabled={readOnly}
              checked={watch('correctOption') === option.name}
              onChange={() => setValue('correctOption', option.name, { shouldValidate: true })}
              className="h-4 w-4 shrink-0 accent-brand-500"
            />
            <Input
              placeholder="Type Option here"
              disabled={readOnly}
              error={errors[option.name]?.message}
              className="flex-1"
              {...register(option.name)}
            />
          </div>
        ))}
      </div>
      {errors.correctOption && (
        <p className="text-sm text-danger-700">{errors.correctOption.message}</p>
      )}

      <Textarea
        label="Explanation (optional)"
        placeholder="Type here"
        disabled={readOnly}
        {...register('explanation')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Level of Difficulty"
          placeholder="Select from Drop-down"
          disabled={readOnly}
          options={[...DIFFICULTY_OPTIONS]}
          {...register('difficulty')}
        />
        <Select
          label="Topic"
          placeholder={isLoadingTopics ? 'Loading…' : 'Select from Drop-down'}
          disabled={readOnly || isLoadingTopics}
          options={topics.map((topic) => ({ value: topic.id, label: topic.name }))}
          {...register('topicId', { onChange: () => setValue('subTopicId', '') })}
        />
        <Select
          label="Sub-topic"
          placeholder={
            !topicId
              ? 'Choose a topic first'
              : isLoadingSubTopics
                ? 'Loading…'
                : 'Select from Drop-down'
          }
          disabled={readOnly || !topicId || isLoadingSubTopics}
          options={(subTopics ?? []).map((subTopic) => ({
            value: subTopic.id,
            label: subTopic.name,
          }))}
          {...register('subTopicId')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-3">
          <Input
            label="Media URL (optional)"
            placeholder="https://..."
            disabled={readOnly}
            error={errors.mediaUrl?.message}
            className="flex-1"
            {...register('mediaUrl')}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Upload Image"
            className="hidden"
            disabled={readOnly}
            onChange={handleImageSelected}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={readOnly}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Image
          </Button>
        </div>
        {imageError && <p className="text-sm text-danger-700">{imageError}</p>}
        {mediaUrl && !errors.mediaUrl && (
          <img
            src={mediaUrl}
            alt="Question media preview"
            className="max-h-40 w-auto rounded-md border border-neutral-200 object-contain"
          />
        )}
      </div>
    </div>
  )
}
