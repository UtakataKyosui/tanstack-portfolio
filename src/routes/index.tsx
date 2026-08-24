import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card } from "#/components/ui/card.tsx";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
				<div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.38),transparent_66%)]" />
				<div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.26),transparent_66%)]" />
				<Badge
					variant="glass"
					className="mb-3 rounded-full px-3 py-1 text-[0.69rem] font-bold uppercase tracking-[0.16em]"
				>
					Frontend Engineer
				</Badge>
				<h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
					「気をつける」を仕組みに変える。
				</h1>
				<p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					型、CI、自動生成。人の注意力に頼るのではなく、間違えようがない状態を
					作ることに関心があります。
				</p>
				<div className="flex flex-wrap gap-3">
					<Button variant="glass" size="lg" className="rounded-full" asChild>
						<Link to="/about">About Me</Link>
					</Button>
					<Button variant="glass" size="lg" className="rounded-full" asChild>
						<Link to="/works">Works</Link>
					</Button>
				</div>
			</section>

			<section className="mt-8 grid gap-4 sm:grid-cols-3">
				{[
					[
						"型で境界を守る",
						"文字列や any で誤魔化さず、型で間違いを実行前に弾く。",
					],
					[
						"CI で機械的に判定する",
						"レビューの見落としに頼らず、基準を機械判定に落とす。",
					],
					[
						"生活も仕組みにする",
						"覚えておくことを減らし、繰り返しを自動化する。",
					],
				].map(([title, desc], index) => (
					<Card
						key={title}
						variant="glass"
						className="rise-in gap-2 rounded-2xl p-5"
						style={{ animationDelay: `${index * 90 + 80}ms` }}
					>
						<h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
							{title}
						</h2>
						<p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
					</Card>
				))}
			</section>
		</main>
	);
}
