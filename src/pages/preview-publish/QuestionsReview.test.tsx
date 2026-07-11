import type { Question } from '@services/questions'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QuestionsReview } from './QuestionsReview'

const question: Question = {
  id: 'question-1',
  question: 'What is 2 + 2?',
  option1: '3',
  option2: '4',
  option3: '5',
  option4: '6',
  correctOption: 'option2',
  explanation: 'Basic addition',
  difficulty: 'easy',
}

describe('QuestionsReview', () => {
  it('shows an empty state when there are no questions', () => {
    render(<QuestionsReview questions={[]} />)
    expect(screen.getByText('No questions have been added to this test yet.')).toBeInTheDocument()
  })

  it('renders each question with all 4 options and highlights the correct one', () => {
    render(<QuestionsReview questions={[question]} />)

    expect(screen.getByText('1. What is 2 + 2?')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()

    const correctOption = screen.getByText('4').closest('li')
    expect(correctOption).not.toBeNull()
    expect(within(correctOption as HTMLElement).getByText('Correct')).toBeInTheDocument()
  })

  it('shows the explanation and difficulty when present', () => {
    render(<QuestionsReview questions={[question]} />)
    expect(screen.getByText(/Basic addition/)).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('numbers multiple questions sequentially', () => {
    render(
      <QuestionsReview
        questions={[question, { ...question, id: 'question-2', question: 'Second question' }]}
      />,
    )
    expect(screen.getByText('1. What is 2 + 2?')).toBeInTheDocument()
    expect(screen.getByText('2. Second question')).toBeInTheDocument()
  })
})
