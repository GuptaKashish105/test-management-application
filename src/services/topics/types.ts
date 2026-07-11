/** Matches the documented `GET /topics/subject/:subjectId` item shape exactly. */
export interface Topic {
  id: string
  name: string
  subject_id: string
}
