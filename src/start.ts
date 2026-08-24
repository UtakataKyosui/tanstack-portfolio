import { createStart } from "@tanstack/react-start";

// CSR を既定にする（issue #9）。データ取得を伴うルートだけ、各ルートの
// `ssr` オプションで個別に SSR / data-only を選び直す。
//
// TanStack Start はリクエストごとに `router.update({ defaultSsr: ... })` を
// 呼び、その値はここ（`src/start.ts` の `createStart`）で設定した
// `defaultSsr` から来る。`createRouter`（`src/router.tsx`）側にも
// `defaultSsr` オプション自体は存在するが、リクエスト時にこの値で
// 上書きされるため、実際に効かせるにはここで設定する必要がある。
export const startInstance = createStart(() => ({
	defaultSsr: false,
}));
