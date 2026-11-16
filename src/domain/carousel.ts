export function visibleCount(compact: boolean): number {
  return compact ? 1 : 2
}

export function alignIndex(
  index: number,
  length: number,
  count: number,
): number {
  if (length <= 0) return 0
  const clamped = Math.min(Math.max(index, 0), length - 1)
  return Math.floor(clamped / count) * count
}

export function stepIndex(
  index: number,
  length: number,
  count: number,
  direction: 1 | -1,
): number {
  if (length <= 0) return 0
  const groupCount = Math.ceil(length / count)
  const currentGroup = Math.floor(alignIndex(index, length, count) / count)
  return ((currentGroup + direction + groupCount) % groupCount) * count
}
