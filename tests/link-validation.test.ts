import { test } from 'node:test'
import assert from 'node:assert/strict'
import { destinationError, linkLanguage, responseError } from '../scripts/link-validation'
test('Deep links cannot pass by redirecting to a homepage or another language', () => {
  const url = 'https://qr.tinystool.org/zh/generate'
  for (const target of ['https://qr.tinystool.org/zh', 'https://qr.tinystool.org/generate', 'https://other.org/zh/generate', 'http://qr.tinystool.org/zh/generate']) assert(destinationError(url, target))
  assert.equal(destinationError(url, url + '/'), undefined)
})
test('HTML checks reject JSON errors and non-success statuses even with the correct URL', () => {
  const url = 'https://qr.tinystool.org/zh/generate'
  assert(responseError(url, 500, url, 'text/html'))
  assert(responseError(url, 200, url, 'application/json'))
  assert.equal(responseError(url, 200, url, 'text/html; charset=utf-8'), undefined)
})
test('Link language is explicit for each URL, not inherited from browser state', () => {
  assert.equal(linkLanguage('https://qr.tinystool.org/zh'), 'zh-CN')
  assert.equal(linkLanguage('https://qr.tinystool.org/zh/generate'), 'zh-CN')
  assert.equal(linkLanguage('https://qr.tinystool.org/generate'), 'en-US')
})
