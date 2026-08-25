import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
	readonly initialQuery?: string;
	readonly className?: string;
}

export function Search({ initialQuery = "", className = "" }: SearchProps) {
	const router = useRouter();
	const [value, setValue] = useState(initialQuery);

	// initialQuery は URL の search param 由来で、ブラウザの戻る/進むなど
	// このコンポーネントをアンマウントせずに変わる遷移がある。value を
	// リセットしないと、入力欄が直前に打った文字列のまま固まる。
	useEffect(() => {
		setValue(initialQuery);
	}, [initialQuery]);

	const handleSearch = useDebouncedCallback((term: string) => {
		router.navigate({
			to: "/writing",
			search: (prev) => ({
				...prev,
				page: 1,
				query: term || undefined,
			}),
			replace: true,
		});
	}, 300);

	return (
		<input
			type="text"
			placeholder="記事を検索..."
			value={value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
				setValue(e.target.value);
				handleSearch(e.target.value);
			}}
			className={`rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon-deep)] ${className}`}
		/>
	);
}
