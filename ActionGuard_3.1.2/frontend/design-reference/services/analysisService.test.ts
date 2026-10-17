import { describe, expect, it, vi } from 'vitest'
import type { Alert } from '@/types'
import { RELINK_FAILED_MESSAGE, withRelink } from './analysisService'
import { ApiError } from './http'

const alert = { id: 'a', originalTextEn: 'old' } as Alert
const fresh = { id: 'a', originalTextEn: 'new' } as Alert

describe('withRelink (409 재연결)', () => {
  it('성공하면 그대로', async () => {
    const call = vi.fn().mockResolvedValue('ok')
    await expect(withRelink(alert, call, vi.fn())).resolves.toBe('ok')
    expect(call).toHaveBeenCalledTimes(1)
  })

  it('409면 경보를 다시 조회해 한 번만 재시도', async () => {
    const call = vi.fn().mockRejectedValueOnce(new ApiError('conflict', 409, 'http')).mockResolvedValueOnce('ok')
    const refetch = vi.fn().mockResolvedValue(fresh)
    await expect(withRelink(alert, call, refetch)).resolves.toBe('ok')
    expect(refetch).toHaveBeenCalledWith('a')
    expect(call).toHaveBeenLastCalledWith(fresh)
    expect(call).toHaveBeenCalledTimes(2)
  })

  it('재시도도 409면 더 시도하지 않고 오류', async () => {
    const call = vi.fn().mockRejectedValue(new ApiError('conflict', 409, 'http'))
    await expect(withRelink(alert, call, vi.fn().mockResolvedValue(fresh))).rejects.toMatchObject({ status: 409 })
    expect(call).toHaveBeenCalledTimes(2)
  })

  it('다시 조회한 목록에 경보가 없으면 오류', async () => {
    const call = vi.fn().mockRejectedValue(new ApiError('conflict', 409, 'http'))
    await expect(withRelink(alert, call, vi.fn().mockResolvedValue(null))).rejects.toThrow(RELINK_FAILED_MESSAGE)
    expect(call).toHaveBeenCalledTimes(1)
  })

  it('409가 아닌 오류는 재시도하지 않음', async () => {
    const call = vi.fn().mockRejectedValue(new ApiError('limit', 429, 'http'))
    const refetch = vi.fn()
    await expect(withRelink(alert, call, refetch)).rejects.toMatchObject({ status: 429 })
    expect(refetch).not.toHaveBeenCalled()
  })
})
