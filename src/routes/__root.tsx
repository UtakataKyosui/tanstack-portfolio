import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "UtakataKyosui — Frontend Engineer",
			},
			{
				name: "description",
				content:
					"「気をつける」を仕組みに変えるフロントエンドエンジニア、UtakataKyosui のポートフォリオ。",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
	// ルーターの `defaultSsr: false`（issue #9、src/start.ts で設定）を子ルートが
	// 個別に上書きできるようにするため、ルートルート自身は明示的に ssr: true と
	// する。TanStack Router は親ルートの ssr が false に解決されると、子ルートが
	// `ssr: true` を指定していても強制的に false へ倒す（親 false が子に伝播する）
	// ため、ルートルートを false のままにすると `/works/$slug` の SSR 指定が
	// 効かなくなってしまう。ルートルート自体は loader を持たない静的レイアウトの
	// ため、ここを true にしてもコスト増は無い。
	ssr: true,
});

function NotFound() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">404</p>
				<h1 className="display-title mb-3 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
					ページが見つかりません。
				</h1>
				<p className="mb-6 m-0 max-w-2xl text-base leading-8 text-[var(--sea-ink-soft)]">
					URL が変わったか、削除された可能性があります。
				</p>
				<Link to="/" className="nav-link">
					&larr; トップページに戻る
				</Link>
			</section>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: 内容は上のモジュール定数リテラルのみで、外部入力は一切混ざらない。初回描画前にテーマを確定させてちらつきを防ぐため、同期スクリプトとして head に埋める必要がある。 */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<Header />
				{children}
				<Footer />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
