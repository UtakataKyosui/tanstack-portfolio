type ContributionDay = {
	date: string;
	count: number;
	level: number;
};

const LEVEL_COLORS = [
	"var(--line)",
	"color-mix(in oklab, var(--lagoon) 35%, var(--line))",
	"color-mix(in oklab, var(--lagoon) 60%, var(--line))",
	"var(--lagoon)",
	"var(--lagoon-deep)",
];

function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
	if (days.length === 0) return [];

	const firstDayOfWeek = new Date(days[0].date).getDay();
	const padded: (ContributionDay | null)[] = [
		...Array(firstDayOfWeek).fill(null),
		...days,
	];

	const weeks: (ContributionDay | null)[][] = [];
	for (let i = 0; i < padded.length; i += 7) {
		weeks.push(padded.slice(i, i + 7));
	}
	return weeks;
}

export function ContributionHeatmap({ days }: { days: ContributionDay[] }) {
	const weeks = buildWeeks(days);

	return (
		<div
			className="grid gap-[3px] overflow-x-auto pb-1"
			style={{
				gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
				gridAutoFlow: "column",
				gridTemplateRows: "repeat(7, minmax(0, 1fr))",
			}}
		>
			{weeks.map((week, weekIndex) =>
				week.map((day, dayIndex) => (
					<div
						key={day?.date ?? `${weekIndex}-${dayIndex}-empty`}
						title={day ? `${day.date}: ${day.count} contributions` : undefined}
						className="aspect-square size-[10px] rounded-[2px]"
						style={{
							backgroundColor: day ? LEVEL_COLORS[day.level] : "transparent",
						}}
					/>
				)),
			)}
		</div>
	);
}
