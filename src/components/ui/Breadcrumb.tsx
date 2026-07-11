export interface BreadcrumbProps {
  items: string[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 && <span className="mx-1.5">/</span>}
          {item}
        </span>
      ))}
    </nav>
  )
}
