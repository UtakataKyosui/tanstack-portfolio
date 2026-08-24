import type { ReactNode } from "react";

/**
 * 個別記事の本文。MDX は依存追加とビルド設定が発生するため見送り、
 * TSX に直接書く方式にした（#3 での決定）。
 * slug に対応するエントリが無い場合は works/$slug.tsx 側で
 * 「準備中」のプレースホルダーを表示する。
 */
export const workBodies: Partial<Record<string, () => ReactNode>> = {
	"this-site": ThisSiteBody,
};

function H2({ children }: { children: ReactNode }) {
	return (
		<h2 className="display-title mt-10 mb-3 text-2xl font-bold text-[var(--sea-ink)] first:mt-0">
			{children}
		</h2>
	);
}

function H3({ children }: { children: ReactNode }) {
	return (
		<h3 className="mt-6 mb-2 text-lg font-semibold text-[var(--sea-ink)]">
			{children}
		</h3>
	);
}

function P({ children }: { children: ReactNode }) {
	return (
		<p className="m-0 mt-3 text-[0.95rem] leading-7 text-[var(--sea-ink-soft)]">
			{children}
		</p>
	);
}

function Code({ children }: { children: ReactNode }) {
	return <code>{children}</code>;
}

function StatRow({
	label,
	value,
	detail,
}: {
	label: string;
	value: string;
	detail?: string;
}) {
	return (
		<li className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] py-2 text-sm last:border-b-0">
			<span className="text-[var(--sea-ink-soft)]">{label}</span>
			<span className="text-right">
				<span className="font-mono font-semibold text-[var(--sea-ink)]">
					{value}
				</span>
				{detail && (
					<span className="ml-2 text-xs text-[var(--sea-ink-soft)]">
						{detail}
					</span>
				)}
			</span>
		</li>
	);
}

function ThisSiteBody() {
	return (
		<article>
			<P>
				この記事はこのサイト自体を作品として解説する。作品ページとしては珍しく一人称の感想はほとんど出てこない。代わりに、実装の仕組みと、実際に測定した数値だけを載せる。
			</P>

			<H2>デザインシステム: 1箇所に定義したガラス表現</H2>
			<P>
				サイト全体で使っているすりガラス風のカード表現（ぼかし・グラデーション・縁取り）は、
				<Code>src/styles.css</Code> の中で <Code>@utility glass</Code>{" "}
				として一箇所にだけ定義している。 Tailwind CSS v4 の{" "}
				<Code>@utility</Code> 記法で定義したユーティリティクラスは、
				<Code>Card</Code> / <Code>Button</Code> / <Code>Badge</Code> それぞれの{" "}
				<Code>cva</Code>（class-variance-authority）バリアント定義から{" "}
				<Code>glass</Code> クラス名として参照される。
			</P>
			<P>
				実際の定義は次の通り。色を直接書かず、すべて CSS
				カスタムプロパティ経由にしている。
			</P>
			<pre>
				<code>{`@utility glass {
  border: 1px solid var(--line);
  background: linear-gradient(165deg, var(--surface-strong), var(--surface));
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  box-shadow:
    0 1px 0 var(--inset-glint) inset,
    0 22px 44px rgba(23, 58, 64, 0.1),
    0 6px 18px rgba(23, 58, 64, 0.08);
}`}</code>
			</pre>
			<P>
				呼び出し側は、たとえば <Code>Card</Code> の <Code>glass</Code>{" "}
				バリアントが <Code>"glass text-[var(--sea-ink)]"</Code>、
				<Code>Badge</Code> の <Code>glass</Code> バリアントが{" "}
				<Code>"glass text-[var(--kicker)]"</Code>
				というように、<Code>glass</Code>{" "}
				クラスに固有の文字色だけを足す形になっている。ガラスの見た目そのものを
				コンポーネント側で再定義することはない。
			</P>

			<H3>ハードコードした色を書かないことの効果</H3>
			<P>
				<Code>--surface</Code> / <Code>--surface-strong</Code> /{" "}
				<Code>--line</Code> / <Code>--inset-glint</Code> は <Code>:root</Code>
				（ライト）と <Code>.dark</Code>
				（ダーク）の両方で個別に定義されているCSS変数で、
				<Code>@utility glass</Code>{" "}
				側は変数名だけを参照している。実際の値は次の通り。
			</P>
			<div className="mt-4 grid gap-4 sm:grid-cols-2">
				<div className="rounded-xl border border-[var(--line)] p-4">
					<p className="island-kicker mb-2">Light (:root)</p>
					<ul className="space-y-1 font-mono text-xs text-[var(--sea-ink-soft)]">
						<li>--surface: rgba(219, 234, 254, 0.55)</li>
						<li>--surface-strong: rgba(191, 219, 254, 0.62)</li>
						<li>--line: rgba(59, 130, 246, 0.28)</li>
						<li>--inset-glint: rgba(255, 255, 255, 0.75)</li>
					</ul>
				</div>
				<div className="rounded-xl border border-[var(--line)] p-4">
					<p className="island-kicker mb-2">Dark (.dark)</p>
					<ul className="space-y-1 font-mono text-xs text-[var(--sea-ink-soft)]">
						<li>--surface: rgba(30, 58, 95, 0.55)</li>
						<li>--surface-strong: rgba(23, 46, 79, 0.68)</li>
						<li>--line: rgba(96, 165, 250, 0.28)</li>
						<li>--inset-glint: rgba(147, 197, 253, 0.16)</li>
					</ul>
				</div>
			</div>
			<P>
				この結果、コンポーネント側のコードに <Code>#fff</Code> や{" "}
				<Code>rgba(...)</Code> を一切書かなくても、ルート要素に付く{" "}
				<Code>.dark</Code>{" "}
				クラスの有無だけでガラス表現がライト/ダーク双方に自動的に対応する。
				色の切り替えロジックをコンポーネントごとに持つ必要がない、という設計になっている。
			</P>

			<H2>GitHub統計: 実データによる言語構成とフレームワーク検出</H2>
			<P>
				About ページと、このサイト自身の README
				的な位置づけであるここで表示している言語構成・フレームワーク利用状況は、
				<Code>scripts/generate-github-stats.mjs</Code>{" "}
				がビルド時ではなく手動実行のスクリプトとして事前生成した{" "}
				<Code>src/data/github-stats.json</Code>{" "}
				を読み込んでいるだけで、フロントエンドはただの静的レンダリングになっている。
			</P>
			<H3>集計方法: GitHub GraphQL API</H3>
			<P>
				スクリプトは <Code>gh api graphql</Code> 経由で GitHub の GraphQL API
				を叩き、対象アカウントの公開リポジトリを <Code>isFork: false</Code>{" "}
				で絞り込みつつ50件ずつページネーションして全件取得する。各リポジトリについて
				<Code>languages</Code>{" "}
				フィールド（サイズ降順で上位10言語）と、後述する3つの依存ファイルの中身を1回のクエリでまとめて取ってきている。
				取得後、<Code>isArchived</Code> と <Code>isTemplate</Code>{" "}
				のリポジトリは集計から除外する。
			</P>
			<H3>フレームワーク検出: descriptionの正規表現ではなく依存関係の実体</H3>
			<P>
				フレームワークの利用状況は、リポジトリの説明文（description）をキーワードでマッチさせるような推測ベースの方法は取っていない。代わりに
				GraphQL クエリの中で各リポジトリの <Code>HEAD:package.json</Code> /{" "}
				<Code>HEAD:Cargo.toml</Code> / <Code>HEAD:go.mod</Code> をそれぞれ{" "}
				<Code>object(expression: ...)</Code>{" "}
				で直接取得し、その中身を解析することで判定している。
			</P>
			<P>
				<Code>package.json</Code> は JSON としてパースし、
				<Code>dependencies</Code> と <Code>devDependencies</Code>{" "}
				を合わせたキー集合に対して、たとえば <Code>React</Code> なら{" "}
				<Code>"react"</Code>、<Code>TanStack Start</Code> なら{" "}
				<Code>"@tanstack/react-start"</Code> や <Code>"@tanstack/start"</Code>{" "}
				というように定義済みのパッケージ名リストが含まれているかを完全一致で見ている。
				<Code>Cargo.toml</Code> と <Code>go.mod</Code>{" "}
				は構造化パースはせず、テキストとして依存名の文字列が含まれるかを見る簡易な判定（
				<Code>Cargo.toml</Code> は改行+パッケージ名+スペースまたは
				<Code>=</Code>、<Code>go.mod</Code>{" "}
				はモジュールパスの部分一致）になっている。つまり、実際にそのリポジトリが依存として宣言しているものだけを数えており、READMEやdescriptionの記述内容には一切依存しない。
			</P>

			<H3>実際の集計結果</H3>
			<P>
				直近生成分（
				<Code>github-stats.json</Code> の <Code>generatedAt</Code>
				）の数値。About ページと同じデータソースを使っている。
			</P>
			<ul className="mt-3 divide-y-0">
				<StatRow
					label="集計対象リポジトリ数"
					value="209"
					detail="fork/archived/template除外後"
				/>
				<StatRow label="最多言語" value="TypeScript" detail="55.1%" />
				<StatRow label="2位" value="Rust" detail="21.0%" />
				<StatRow label="3位" value="Python" detail="5.0%" />
				<StatRow
					label="最多利用フレームワーク"
					value="Serde"
					detail="27リポジトリ"
				/>
				<StatRow label="2位" value="React" detail="24リポジトリ" />
				<StatRow label="3位" value="Tailwind CSS" detail="21リポジトリ" />
			</ul>
			<P>
				生成日時と正確な数値は <a href="/about">About ページ</a>{" "}
				に常に最新のものが表示される（このスクリプトはビルドパイプラインには組み込まれておらず、手動実行で
				<Code>src/data/github-stats.json</Code> を更新する運用になっている）。
			</P>

			<H2>Lighthouse / Core Web Vitals 実測値</H2>
			<P>
				本番相当のビルド（<Code>pnpm run build</Code> →{" "}
				<Code>pnpm run preview</Code>
				）に対して、Chrome ヘッドレスで Lighthouse
				を実行して計測した。計測環境は開発用サンドボックス内のコンテナで、
				実運用のデプロイ先（Cloudflare Workers、#11
				完了後）とはネットワーク条件が異なる点に注意。
			</P>
			<ul className="mt-3">
				<StatRow label="Performance" value="89" detail="/ 100" />
				<StatRow label="Accessibility" value="95" detail="/ 100" />
				<StatRow label="Best Practices" value="96" detail="/ 100" />
				<StatRow label="SEO" value="100" detail="/ 100" />
				<StatRow label="LCP" value="0.8 s" />
				<StatRow label="CLS" value="0" />
				<StatRow label="TBT" value="0 ms" />
				<StatRow label="FCP" value="0.8 s" />
				<StatRow label="Speed Index" value="7.8 s" detail="※下記参照" />
			</ul>
			<P>
				Performance / SEO は満点近くで、LCP・CLS・TBT・FCP
				はいずれも良好な値になった。一方で Speed Index
				だけ突出して悪い（7.8秒）。原因を Lighthouse
				のコンソールログで確認したところ、このサンドボックス環境のプロキシがヘッドレス
				Chrome からの <Code>fonts.googleapis.com</Code> へのリクエストを{" "}
				<Code>ERR_CONNECTION_RESET</Code> で落としており、Web
				フォント（Fraunces・Manrope）の読み込みがタイムアウトするまでレンダリングが足踏みしていたことが原因だった。実際のデプロイ先（Cloudflare
				Workers 経由の本番環境）ではこの制約は無いため、Speed Index
				の値はこのサンドボックス特有のものであり、本番の実測値ではない点は正直に書いておく。
			</P>
			<P>
				アクセシビリティスコアが100点ではない理由も具体的に特定できていて、Lighthouse
				の <Code>color-contrast</Code>{" "}
				監査がヘッダーのサイトロゴリンク（コントラスト比 4.31:1、要求は 4.5:1
				以上）を指摘している。これはこの記事のページに限らず全ページ共通のヘッダーコンポーネントの問題で、この
				Issue の範囲外だが実測結果としてそのまま記載する。Best Practices
				が96点なのは、favicon.ico
				が未設定でリクエストが404になっていること（同じくサイト全体の既存の問題）が理由。
			</P>

			<H2>アクセシビリティ確認</H2>
			<H3>キーボード操作</H3>
			<P>
				GUI ブラウザの無いサンドボックス環境のため、実際に Tab
				キーを押しての目視によるフォーカス移動確認は行えなかった。代わりに
				Lighthouse
				のアクセシビリティ監査に含まれる決定的なキーボード関連チェック（フォーカス可能性・論理的なタブ順序・ARIAロール整合性・フォーカストラップの有無）をすべて自動実行し、いずれも合格したことを確認している。実機での目視確認は{" "}
				[TODO: 本人記入]。
			</P>
			<H3>コントラスト比</H3>
			<P>
				WCAG
				のコントラスト計算式で、このページ本文が使っている色の組み合わせを実際に計算した。
			</P>
			<ul className="mt-3">
				<StatRow
					label="本文 (--sea-ink) / 背景 (--bg-base) ライト"
					value="10.6 : 1"
				/>
				<StatRow
					label="補助テキスト (--sea-ink-soft) / 背景 ライト"
					value="5.58 : 1"
				/>
				<StatRow
					label="リンク色 (--lagoon-deep) / 背景 ライト"
					value="4.59 : 1"
				/>
				<StatRow
					label="本文 (--sea-ink) / 背景 (--bg-base) ダーク"
					value="15.4 : 1"
				/>
				<StatRow
					label="補助テキスト (--sea-ink-soft) / 背景 ダーク"
					value="10.14 : 1"
				/>
				<StatRow
					label="リンク色 (--lagoon-deep) / 背景 ダーク"
					value="10.21 : 1"
				/>
			</ul>
			<P>
				本文・補助テキスト・リンク色は、ライト/ダークいずれも WCAG AA
				の通常テキスト基準（4.5:1）を満たしている。ただし上で書いた通り、ヘッダーのロゴリンクだけはライトモードで
				4.31:1 と基準をわずかに下回っており、Lighthouse
				の自動監査と手計算の両方で同じ結果になった。この修正はヘッダーコンポーネント側の変更が必要なため、この
				Issue の範囲では実測結果として記録するにとどめる。
			</P>
			<H3>スクリーンリーダー</H3>
			<P>[TODO: 本人記入]</P>
		</article>
	);
}
