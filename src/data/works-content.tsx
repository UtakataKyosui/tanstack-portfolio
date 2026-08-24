import type { ReactNode } from "react";

/**
 * 個別記事の本文。MDX は依存追加とビルド設定が発生するため見送り、
 * TSX に直接書く方式にした（#3 での決定）。
 * slug に対応するエントリが無い場合は works/$slug.tsx 側で
 * 「準備中」のプレースホルダーを表示する。
 */
export const workBodies: Partial<Record<string, () => ReactNode>> = {};
