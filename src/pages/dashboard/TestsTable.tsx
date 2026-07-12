import { paths } from '@app/router/paths'
import { Badge, Button, LinkButton } from '@components/ui'
import type { Test } from '@services/tests'
import { formatDate } from '@utils/formatDate'

import { getStatusBadgeInfo } from './statusBadge'

export interface TestsTableProps {
  tests: Test[]
  onDelete: (test: Test) => void
  onEdit: (test: Test) => void
}

export function TestsTable({ tests, onDelete, onEdit }: TestsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-700">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Subject
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Created
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {tests.map((test) => {
            const status = getStatusBadgeInfo(test.status)
            return (
              <tr key={test.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{test.name}</td>
                <td className="px-4 py-3 text-neutral-700">{test.subject}</td>
                <td className="px-4 py-3">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </td>
                <td className="px-4 py-3 text-neutral-700">{formatDate(test.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <LinkButton to={paths.previewPublish(test.id)} variant="ghost" size="sm">
                      View
                    </LinkButton>
                    <Button variant="secondary" size="sm" onClick={() => onEdit(test)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(test)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
