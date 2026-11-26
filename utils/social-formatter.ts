// Pure DTO formatting: database timestamp-without-time-zone values are stored in UTC.
// Keep this separate from the legacy client toast utilities used by the protected auth flow.
export function formatSocialValue(value: unknown, key = ""): unknown {
  if (value instanceof Date) return value.toISOString()
  if (
    typeof value === "string" &&
    /(At|_at)$/.test(key) &&
    /^\d{4}-\d{2}-\d{2}[T ]/.test(value)
  ) {
    const text = value.replace(" ", "T"),
      date = new Date(
        /(?:Z|[+-]\d\d(?::?\d\d)?)$/.test(text) ? text : text + "Z"
      )
    return Number.isNaN(date.getTime()) ? value : date.toISOString()
  }
  if (Array.isArray(value)) return value.map((item) => formatSocialValue(item))
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([name, item]) => [
        name,
        formatSocialValue(item, name),
      ])
    )
  return value
}
