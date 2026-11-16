export interface RepositorySummary {
  name: string
  language: string | null
  stars: number
  pushedAt: string
}

const repositoryPattern = /^[\w.-]+\/[\w.-]+$/

export function repositoryFromSource(source: string): string | null {
  try {
    const url = new URL(source)
    if (url.hostname !== 'github.com') return null
    const name = url.pathname.replace(/^\/|\/$/g, '')
    return repositoryPattern.test(name) ? name : null
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Narrows a GitHub REST repository response to the fields the site shows. */
export function parseRepository(value: unknown): RepositorySummary | null {
  if (!isRecord(value)) return null
  const { full_name, language, stargazers_count, pushed_at } = value
  if (
    typeof full_name !== 'string' ||
    !repositoryPattern.test(full_name) ||
    (language !== null && typeof language !== 'string') ||
    typeof stargazers_count !== 'number' ||
    typeof pushed_at !== 'string' ||
    Number.isNaN(Date.parse(pushed_at))
  )
    return null
  return {
    name: full_name,
    language,
    stars: stargazers_count,
    pushedAt: pushed_at,
  }
}

export function isRepositorySummary(
  value: unknown,
): value is RepositorySummary {
  return (
    isRecord(value) &&
    parseRepository({
      full_name: value.name,
      language: value.language,
      stargazers_count: value.stars,
      pushed_at: value.pushedAt,
    }) !== null
  )
}
