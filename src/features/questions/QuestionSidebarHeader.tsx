export interface QuestionSidebarHeaderProps {
  count: number
}

/** Shared label + count row for both the Add Questions and Preview & Publish question sidebars. */
export function QuestionSidebarHeader({ count }: QuestionSidebarHeaderProps) {
  return (
    <>
      <p className="text-xs font-semibold text-neutral-500">Question creation</p>
      <p className="text-sm font-medium text-neutral-800">Total Questions : {count}</p>
    </>
  )
}
