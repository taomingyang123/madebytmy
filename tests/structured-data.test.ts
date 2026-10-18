import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serializeStructuredData } from '../shared/structured-data'
test('JSON-LD escapes closing script tags without changing content after JSON parsing', () => {
  const value = { description: 'a < b; </script><script>alert(1)</script>', name: '中文 & "quotes"' }
  const output = serializeStructuredData(value)
  assert(!output.includes('<'))
  assert.deepEqual(JSON.parse(output), value)
})
