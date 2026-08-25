Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Replace the Tailwind import in `src/styles.css` with your own styles
2. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
3. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## Deploy to Cloudflare Workers

This project uses the Cloudflare Vite plugin (configured in `vite.config.ts`) and `wrangler.jsonc`. `package.json` also provides a `pnpm deploy` script (`build` + `wrangler deploy`).

### 事前設定チェック

- **Worker 名**: `wrangler.jsonc` の `name` は `tanstack-portfolio`。初回デプロイ時にこの名前で新しい Worker が作成される（まだ一度もデプロイしていないため、既存 Worker との衝突は無い）。
- **`compatibility_date`**: 現状 `2025-09-02`。デプロイ前に [Cloudflare Workers の compatibility date](https://developers.cloudflare.com/workers/configuration/compatibility-dates/) を確認し、必要なら実デプロイ時に最新日付へ更新するかどうかを判断する。
- **環境変数 / シークレット**: 現時点でこのアプリはビルド時に静的な JSON を import しているだけで、実行時に外部 API やシークレットを利用する機能は無い（`src/env.ts` は `SERVER_URL` / `VITE_APP_TITLE` を宣言しているが、どちらもコード内から一切 import/使用されていない）。そのため **現時点では Cloudflare 側で `wrangler secret put` するシークレットは不要**。`src/env.ts` を今後使う予定が無いなら削除、使う予定があるなら実際に値を参照する箇所を追加する、のどちらかを別途検討する。
- **OGP / メタタグ**: `src/routes/__root.tsx` に `og:title` / `og:description` / `twitter:card` 等は追加済み。`og:image`（1200x630px 目安）と `og:url` は画像ファイルと本番ドメインが決まってから追加する（該当箇所に TODO コメントあり）。

### デプロイ手順

1. Install Wrangler: `npm install -g wrangler`（または既に devDependencies にある `wrangler` を `pnpm exec wrangler ...` で使ってもよい）
2. Authenticate: `wrangler login`
3. Deploy: `npx wrangler deploy`（もしくは `pnpm deploy`）

For production env vars, run `wrangler secret put MY_VAR` for each secret the app actually needs at runtime (see above — currently none). Public (non-secret) vars go in `wrangler.jsonc` under `vars`.

KV, D1, R2, and Durable Object bindings are configured in `wrangler.jsonc` — see https://developers.cloudflare.com/workers/wrangler/configuration/.

### 本人が実施する残タスク（このリポジトリの自動化では行わない）

- [ ] `wrangler deploy`（または `pnpm deploy`）を実行して実際にデプロイし、公開された URL で動作確認する
- [ ] 独自ドメインを使うかどうかを決め、使う場合は Cloudflare 側でカスタムドメインを設定する
- [ ] 独自ドメインが決まったら OGP の `og:image` / `og:url`（および `twitter:image`）を追加する


## GitHub Stats の生成

`src/data/github-stats.json` は、GitHub 上の公開リポジトリの言語構成・使用フレームワークを集計した静的データです。`/about` ページで表示する統計情報として、コミットされたファイルをそのままビルドに使います。

再生成する手順:

```bash
gh auth login   # 未認証の場合のみ。GitHub CLI の認証が必要
pnpm generate:github-stats
```

- 実行には [GitHub CLI (`gh`)](https://cli.github.com/) がインストールされ、認証済みであることが必要です。未認証だと `gh api graphql` 呼び出しが失敗します。
- スクリプトは `scripts/generate-github-stats.mjs` で、`UtakataKyosui` の公開リポジトリ一覧を GraphQL で取得し、`src/data/github-stats.json` を上書き生成します。
- 生成後は差分を確認し、**`src/data/github-stats.json` をコミットしてください**。このファイルはビルド成果物ではなく、リポジトリにコミットして使う静的データです。
- **ビルド時には自動実行しません。** デプロイ先の Cloudflare Workers には GitHub 認証トークンを配置していないため、ビルド中に未認証で GitHub API を叩くとレート制限（未認証は60リクエスト/時）にすぐ到達してビルドが不安定になります。そのため統計の更新は手動実行して生成物をコミットする運用とし、`build` スクリプトからは呼び出していません。
- 更新が必要になるタイミングの目安: 新しいリポジトリを作成した、使用言語・フレームワーク構成が変わった、しばらく再生成していない、など。


## D1 / Articles Database

記事は Cloudflare D1 に保存する。スキーマは `src/db/schema.ts` に Drizzle ORM で定義しており、`src/db/client.ts` の `getDb()` が `cloudflare:workers` から `env.DB` を取り出して Drizzle クライアントを返す。

### binding の露出について

このアプリは `@cloudflare/vite-plugin` を SSR 環境に読み込んで `pnpm dev` から D1 にアクセスする。server function からは `const { env } = await import("cloudflare:workers")` で `env.DB` が `D1Database` として取得できることを実機で確認済み。ローカル開発時も本番の Worker 実行時と同じ経路になる。

`D1Database` や `Env` の型は `worker-configuration.d.ts` に生成してリポジトリへコミットしている。`wrangler.jsonc` の binding を追加・変更したら次のコマンドで再生成する。

```bash
pnpm exec wrangler types
```

### マイグレーションの生成と適用

スキーマを変更したら、まずマイグレーション SQL を生成する。

```bash
pnpm exec drizzle-kit generate --name <変更内容がわかる名前>
```

`migrations/` にマイグレーションファイルが追加される。`drizzle.config.ts` の `out` を `wrangler d1 migrations apply` の既定ディレクトリに合わせているため、`migrations_dir` の指定は不要。

ローカルの D1（`.wrangler/state` 配下の SQLite ファイル、gitignore 済み）に適用する。

```bash
pnpm exec wrangler d1 migrations apply tanstack-portfolio-articles --local
```

本番の D1 に適用するときは `--remote` を付ける。ただしその前に、次の節で実データベースを作成しておく必要がある。

### 実データベースの作成（本人が実施する）

`wrangler.jsonc` の `d1_databases` に置いてある `database_id` は開発用のダミー値である。実際に Cloudflare 上のリソースとして D1 を作るには、`wrangler login` で認証したうえで以下を実行する。

```bash
pnpm exec wrangler login
pnpm exec wrangler d1 create tanstack-portfolio-articles
```

出力される `database_id` を `wrangler.jsonc` のダミー値と差し替えてから、`--remote` でマイグレーションを適用する。

```bash
pnpm exec wrangler d1 migrations apply tanstack-portfolio-articles --remote
```


## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpm dlx shadcn@latest add button
```


## T3Env

- You can use T3Env to add type safety to your environment variables.
- Add Environment variables to the `src/env.ts` file.
- Use the environment variables in your code.

### Usage

```ts
import { env } from "#/env";

console.log(env.VITE_APP_TITLE);
```






## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).


# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
