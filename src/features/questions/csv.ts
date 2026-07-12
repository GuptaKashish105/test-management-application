import type { QuestionFormInput } from './questionSchema'
import { questionSchema } from './questionSchema'

const REQUIRED_COLUMNS = [
  'question',
  'option1',
  'option2',
  'option3',
  'option4',
  'correct_option',
] as const

export interface CsvImportResult {
  records: QuestionFormInput[]
  errors: string[]
}

/** Escapes plain CSV text before it's stored as the (HTML) question value — see RichTextEditor. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Handles quoted fields (with embedded commas/escaped quotes) per basic RFC4180 rules. */
function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      cells.push(current)
      current = ''
    } else {
      current += char
    }
  }
  cells.push(current)
  return cells
}

/**
 * Parses a CSV file into draft questions, reusing `questionSchema` so a CSV row is held to
 * the exact same validity rules as the manual entry form. Expected header (case-insensitive):
 * `question,option1,option2,option3,option4,correct_option,explanation,difficulty` — the last
 * two columns are optional. Rows that fail validation are skipped and reported, not silently
 * dropped, so a partially-bad file still imports everything that's valid.
 */
export function parseQuestionsCsv(text: string): CsvImportResult {
  const lines = text.split(/\r\n|\n|\r/).filter((line) => line.trim().length > 0)
  if (lines.length === 0) {
    return { records: [], errors: ['The CSV file is empty.'] }
  }

  const header = parseCsvLine(lines[0]).map((cell) => cell.trim().toLowerCase())
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !header.includes(column))
  if (missingColumns.length > 0) {
    return {
      records: [],
      errors: [`Missing required column(s): ${missingColumns.join(', ')}.`],
    }
  }

  const cellByName = (cells: string[], name: string): string => {
    const index = header.indexOf(name)
    return index >= 0 ? (cells[index] ?? '').trim() : ''
  }

  const records: QuestionFormInput[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1 // 1-indexed, counting the header row
    const cells = parseCsvLine(lines[i])

    const candidate: QuestionFormInput = {
      question: escapeHtml(cellByName(cells, 'question')),
      option1: cellByName(cells, 'option1'),
      option2: cellByName(cells, 'option2'),
      option3: cellByName(cells, 'option3'),
      option4: cellByName(cells, 'option4'),
      correctOption: cellByName(cells, 'correct_option'),
      explanation: cellByName(cells, 'explanation'),
      difficulty: cellByName(cells, 'difficulty'),
      topicId: '',
      subTopicId: '',
      mediaUrl: '',
    }

    const result = questionSchema.safeParse(candidate)
    if (!result.success) {
      errors.push(`Row ${rowNumber}: ${result.error.issues[0]?.message ?? 'Invalid data.'}`)
      continue
    }

    records.push(candidate)
  }

  return { records, errors }
}
