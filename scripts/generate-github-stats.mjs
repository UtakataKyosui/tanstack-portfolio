import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const GITHUB_LOGIN = 'UtakataKyosui'
const OUT_PATH = fileURLToPath(
  new URL('../src/data/github-stats.json', import.meta.url),
)

const QUERY = `
query($login: String!, $after: String) {
  user(login: $login) {
    repositories(
      first: 50
      after: $after
      isFork: false
      orderBy: { field: PUSHED_AT, direction: DESC }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name
        isArchived
        isTemplate
        repositoryTopics(first: 20) {
          nodes { topic { name } }
        }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
        pkg: object(expression: "HEAD:package.json") { ... on Blob { text } }
        cargo: object(expression: "HEAD:Cargo.toml") { ... on Blob { text } }
        gomod: object(expression: "HEAD:go.mod") { ... on Blob { text } }
      }
    }
  }
}
`

const CONTRIBUTIONS_QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
      commitContributionsByRepository(maxRepositories: 100) {
        repository { name }
        contributions { totalCount }
      }
    }
  }
}
`

function ghGraphql(query, vars) {
  const args = ['api', 'graphql', '-f', `query=${query}`]
  for (const [key, value] of Object.entries(vars)) {
    if (value != null) args.push('-f', `${key}=${value}`)
  }
  const out = execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  })
  return JSON.parse(out)
}

function fetchContributionDays() {
  const res = ghGraphql(CONTRIBUTIONS_QUERY, { login: GITHUB_LOGIN })
  if (res.errors) {
    throw new Error(`GitHub GraphQL error: ${JSON.stringify(res.errors)}`)
  }
  const collection = res.data.user.contributionsCollection
  const calendar = collection.contributionCalendar
  const days = calendar.weeks.flatMap((week) => week.contributionDays)
  const commitsByRepo = collection.commitContributionsByRepository.map(
    (entry) => ({
      repoName: entry.repository.name,
      commitCount: entry.contributions.totalCount,
    }),
  )
  return { totalContributions: calendar.totalContributions, days, commitsByRepo }
}

function fetchAllRepos() {
  const repos = []
  let after = null
  for (;;) {
    const res = ghGraphql(QUERY, { login: GITHUB_LOGIN, after })
    if (res.errors) {
      throw new Error(`GitHub GraphQL error: ${JSON.stringify(res.errors)}`)
    }
    const page = res.data.user.repositories
    repos.push(...page.nodes)
    if (!page.pageInfo.hasNextPage) break
    after = page.pageInfo.endCursor
  }
  return repos
}

const FRAMEWORK_DEPS = {
  React: ['react'],
  'Next.js': ['next'],
  'TanStack Start': ['@tanstack/react-start', '@tanstack/start'],
  'TanStack Router': ['@tanstack/react-router'],
  'TanStack Query': ['@tanstack/react-query'],
  Vue: ['vue'],
  Nuxt: ['nuxt'],
  Astro: ['astro'],
  Svelte: ['svelte'],
  Tauri: ['@tauri-apps/api', 'tauri'],
  Electron: ['electron'],
  Express: ['express'],
  Fastify: ['fastify'],
  Hono: ['hono'],
  NestJS: ['@nestjs/core'],
  Vite: ['vite'],
  'Tailwind CSS': ['tailwindcss'],
}

const CARGO_FRAMEWORKS = {
  Axum: ['axum'],
  Actix: ['actix-web'],
  Rocket: ['rocket'],
  Tauri: ['tauri'],
  Serde: ['serde'],
  Tokio: ['tokio'],
}

const GOMOD_FRAMEWORKS = {
  Gin: ['github.com/gin-gonic/gin'],
  Echo: ['github.com/labstack/echo'],
  Cobra: ['github.com/spf13/cobra'],
}

function detectFrameworks(repo) {
  const found = new Set()

  if (repo.pkg?.text) {
    let pkg
    try {
      pkg = JSON.parse(repo.pkg.text)
    } catch {
      pkg = null
    }
    if (pkg) {
      const deps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
      }
      for (const [label, names] of Object.entries(FRAMEWORK_DEPS)) {
        if (names.some((n) => n in deps)) found.add(label)
      }
    }
  }

  if (repo.cargo?.text) {
    for (const [label, names] of Object.entries(CARGO_FRAMEWORKS)) {
      if (names.some((n) => repo.cargo.text.includes(`\n${n} `) || repo.cargo.text.includes(`\n${n}=`))) {
        found.add(label)
      }
    }
  }

  if (repo.gomod?.text) {
    for (const [label, names] of Object.entries(GOMOD_FRAMEWORKS)) {
      if (names.some((n) => repo.gomod.text.includes(n))) found.add(label)
    }
  }

  return [...found]
}

function withContributionLevels(days) {
  const nonZero = days.map((d) => d.contributionCount).filter((c) => c > 0)
  const sorted = [...nonZero].sort((a, b) => a - b)
  const quartile = (q) => sorted[Math.floor(sorted.length * q)] ?? 0
  const t1 = quartile(0.25) || 1
  const t2 = quartile(0.5) || t1
  const t3 = quartile(0.75) || t2

  return days.map((d) => {
    const c = d.contributionCount
    let level = 0
    if (c > 0) level = 1
    if (c >= t1) level = 2
    if (c >= t2) level = 3
    if (c >= t3) level = 4
    return { date: d.date, count: c, level }
  })
}

function main() {
  const allRepos = fetchAllRepos()
  const repos = allRepos.filter((r) => !r.isArchived && !r.isTemplate)
  const { totalContributions, days, commitsByRepo } = fetchContributionDays()
  const contributionDays = withContributionLevels(days)

  const workRepoNames = new Set(
    allRepos
      .filter((r) =>
        r.repositoryTopics.nodes.some((t) => t.topic.name === 'work'),
      )
      .map((r) => r.name),
  )

  let workCommits = 0
  let privateCommits = 0
  for (const { repoName, commitCount } of commitsByRepo) {
    if (workRepoNames.has(repoName)) {
      workCommits += commitCount
    } else {
      privateCommits += commitCount
    }
  }

  const languageBytes = {}
  const frameworkRepoCount = {}

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      languageBytes[edge.node.name] =
        (languageBytes[edge.node.name] ?? 0) + edge.size
    }
    for (const fw of detectFrameworks(repo)) {
      frameworkRepoCount[fw] = (frameworkRepoCount[fw] ?? 0) + 1
    }
  }

  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0)
  const languages = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: totalBytes ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)

  const frameworks = Object.entries(frameworkRepoCount)
    .map(([name, repoCount]) => ({ name, repoCount }))
    .sort((a, b) => b.repoCount - a.repoCount)

  const output = {
    login: GITHUB_LOGIN,
    generatedAt: new Date().toISOString(),
    repoCount: repos.length,
    languages,
    frameworks,
    contributions: {
      total: totalContributions,
      days: contributionDays,
      commitBreakdown: { work: workCommits, private: privateCommits },
    },
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Wrote ${OUT_PATH}`)
  console.log(`repos: ${repos.length}, languages: ${languages.length}, frameworks: ${frameworks.length}, contribution days: ${contributionDays.length}, work commits: ${workCommits}, private commits: ${privateCommits}`)
}

main()
