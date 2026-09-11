import { describe, expect, it } from 'vitest'
import { extensionForImage } from './image-file'

describe('extensionForImage', () => {
  it('maps jpeg/png mime types', () => {
    expect(extensionForImage({ name: 'a', type: 'image/jpeg' })).toBe('jpg')
    expect(extensionForImage({ name: 'a', type: 'image/png' })).toBe('png')
  })

  it('falls back to the filename when mime is empty (Windows jpg)', () => {
    expect(extensionForImage({ name: 'foto.JPG', type: '' })).toBe('jpg')
    expect(extensionForImage({ name: 'foto.png', type: '' })).toBe('png')
  })

  it('rejects non-images', () => {
    expect(extensionForImage({ name: 'doc.pdf', type: 'application/pdf' })).toBeNull()
  })
})
