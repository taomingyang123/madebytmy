// Escape HTML delimiters while preserving the original JSON string values.
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
