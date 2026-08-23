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

function ghGraphql(after) {
  const args = [
    'api',
    'graphql',
    '-f',
    `query=${QUERY}`,
    '-f',
    `login=${GITHUB_LOGIN}`,
  ]
  if (after) args.push('-f', `after=${after}`)
  const out = execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  })
  return JSON.parse(out)
}

function fetchAllRepos() {
  const repos = []
  let after = null
  for (;;) {
    const res = ghGraphql(after)
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

function main() {
  const repos = fetchAllRepos().filter((r) => !r.isArchived && !r.isTemplate)

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
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Wrote ${OUT_PATH}`)
  console.log(`repos: ${repos.length}, languages: ${languages.length}, frameworks: ${frameworks.length}`)
}

main()
