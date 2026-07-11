const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

/** Formats an ISO 8601 date string (e.g. `created_at`) for display. Returns the raw input if unparsable. */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return isoDate
  }
  return dateFormatter.format(date)
}
