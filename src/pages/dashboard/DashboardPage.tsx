import { paths } from '@app/router/paths'
import { PageContainer } from '@components/layout'
import { Alert, Button, Input, LinkButton, Modal, Spinner } from '@components/ui'
import { useTests } from '@features/tests'
import type { Test } from '@services/tests'
import { useMemo, useState } from 'react'

import { TestsTable } from './TestsTable'

export function DashboardPage() {
  const { data: tests, isLoading, isError, error, refetch, isFetching } = useTests()
  const [search, setSearch] = useState('')
  const [testPendingDelete, setTestPendingDelete] = useState<Test | null>(null)

  const filteredTests = useMemo(() => {
    if (!tests) return []
    const query = search.trim().toLowerCase()
    if (!query) return tests
    return tests.filter(
      (test) =>
        test.name.toLowerCase().includes(query) || test.subject.toLowerCase().includes(query),
    )
  }, [tests, search])

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Tests</h1>
        <LinkButton to={paths.testCreate}>Create New Test</LinkButton>
      </div>

      <div className="mt-4">
        <Input
          label="Search"
          placeholder="Search by name or subject"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-neutral-500">
            <Spinner />
            <span>Loading tests…</span>
          </div>
        )}

        {isError && (
          <Alert tone="danger">
            <div className="flex items-center justify-between gap-4">
              <span>{error?.message ?? 'Failed to load tests.'}</span>
              <Button variant="secondary" size="sm" onClick={() => refetch()} isLoading={isFetching}>
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {!isLoading && !isError && tests && tests.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-200 py-16 text-center">
            <p className="text-neutral-700">No tests yet.</p>
            <LinkButton to={paths.testCreate} size="sm">
              Create your first test
            </LinkButton>
          </div>
        )}

        {!isLoading && !isError && tests && tests.length > 0 && filteredTests.length === 0 && (
          <p className="py-16 text-center text-neutral-500">No tests match your search.</p>
        )}

        {!isLoading && !isError && filteredTests.length > 0 && (
          <TestsTable tests={filteredTests} onDelete={setTestPendingDelete} />
        )}
      </div>

      <Modal
        isOpen={testPendingDelete !== null}
        onClose={() => setTestPendingDelete(null)}
        title="Delete test"
      >
        <p className="text-sm text-neutral-700">
          {testPendingDelete && (
            <>
              You&apos;re about to delete <strong>{testPendingDelete.name}</strong>.
            </>
          )}
        </p>
        <Alert tone="warning" className="mt-4">
          Deleting isn&apos;t available yet — the API documentation doesn&apos;t specify a delete
          endpoint. This will be wired up once it&apos;s confirmed.
        </Alert>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setTestPendingDelete(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}
