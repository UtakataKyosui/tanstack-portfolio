import { useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	pageCount: number;
	className?: string;
}

export function Pagination({
	currentPage,
	pageCount,
	className = "",
}: PaginationProps) {
	const router = useRouter();

	const handlePageChange = (page: number) => {
		router.navigate({
			to: "/writing",
			search: (prev) => ({ ...prev, page }),
			replace: true,
		});
	};

	const getPageNumbers = () => {
		const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [];
		const showEllipsis = pageCount > 7;

		if (showEllipsis) {
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis-start");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(pageCount - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < pageCount - 2) {
				pages.push("ellipsis-end");
			}

			if (pageCount > 1) {
				pages.push(pageCount);
			}
		} else {
			for (let i = 1; i <= pageCount; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	if (pageCount <= 1) return null;

	const pageNumbers = getPageNumbers();

	return (
		<nav className={`flex items-center justify-center gap-1 ${className}`}>
			<button
				type="button"
				onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--sea-ink)] transition-colors hover:border-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronLeft className="h-4 w-4" />
				<span className="hidden sm:inline">前へ</span>
			</button>

			<div className="flex items-center gap-1">
				{pageNumbers.map((page) =>
					page === "ellipsis-start" || page === "ellipsis-end" ? (
						<span
							key={page}
							className="hidden px-2 py-2 text-[var(--sea-ink-soft)] md:block"
						>
							…
						</span>
					) : (
						<button
							type="button"
							key={page}
							onClick={() => handlePageChange(page)}
							className={`min-w-[40px] rounded-full border px-3 py-1.5 text-sm transition-colors ${
								currentPage === page
									? "border-[var(--lagoon-deep)] bg-[var(--lagoon-deep)] text-white"
									: "border-[var(--line)] bg-[var(--surface)] text-[var(--sea-ink)] hover:border-[var(--lagoon-deep)]"
							}`}
						>
							{page}
						</button>
					),
				)}
			</div>

			<button
				type="button"
				onClick={() =>
					currentPage < pageCount && handlePageChange(currentPage + 1)
				}
				disabled={currentPage >= pageCount}
				className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--sea-ink)] transition-colors hover:border-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
			>
				<span className="hidden sm:inline">次へ</span>
				<ChevronRight className="h-4 w-4" />
			</button>
		</nav>
	);
}
