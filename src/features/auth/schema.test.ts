import { describe, expect, it } from 'vitest'

import { loginSchema } from './schema'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ userId: 'vedant-admin', password: 'vedant123' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty userId', () => {
    const result = loginSchema.safeParse({ userId: '', password: 'vedant123' })
    expect(result.success).toBe(false)
  })

  it('rejects a userId that is only whitespace', () => {
    const result = loginSchema.safeParse({ userId: '   ', password: 'vedant123' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ userId: 'vedant-admin', password: '' })
    expect(result.success).toBe(false)
  })

  it('trims the userId', () => {
    const result = loginSchema.safeParse({ userId: '  vedant-admin  ', password: 'vedant123' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.userId).toBe('vedant-admin')
    }
  })
})
