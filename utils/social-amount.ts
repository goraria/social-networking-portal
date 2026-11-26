export function formatSocialAmount(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  })
  const exponent = formatter.resolvedOptions().maximumFractionDigits ?? 2
  return formatter.format(amount / 10 ** exponent)
}
