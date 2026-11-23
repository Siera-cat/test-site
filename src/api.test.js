import { describe, it, expect, vi, afterEach } from 'vitest'
import { searchBooks } from './api'

afterEach(() => vi.unstubAllGlobals())

describe('searchBooks', () => {
    it('возвращает список книг', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ docs: [{ title: 'Dune' }] }),
        }))
        const books = await searchBooks('dune')
        expect(books).toHaveLength(1)
        expect(books[0].title).toBe('Other')
    })

    it('кидает ошибку при плохом ответе сети', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
        await expect(searchBooks('dune')).rejects.toThrow('500')
    })
})