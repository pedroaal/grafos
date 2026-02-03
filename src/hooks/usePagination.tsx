import { createSignal, createMemo } from "solid-js";

/**
 * Hook for managing pagination state
 * @param initialPerPage - Initial items per page (default: 10)
 * @returns Pagination state and controls
 */
export const usePagination = (initialPerPage = 10) => {
	const [page, setPage] = createSignal(1);
	const [perPage, setPerPage] = createSignal(initialPerPage);
	const [totalItems, setTotalItems] = createSignal(0);

	const totalPages = createMemo(() => {
		const total = totalItems();
		const per = perPage();
		return total > 0 ? Math.ceil(total / per) : 0;
	});

	const hasNext = createMemo(() => page() < totalPages());
	const hasPrev = createMemo(() => page() > 1);

	const goToNext = () => {
		if (hasNext()) {
			setPage(page() + 1);
		}
	};

	const goToPrev = () => {
		if (hasPrev()) {
			setPage(page() - 1);
		}
	};

	const goToFirst = () => {
		setPage(1);
	};

	const goToLast = () => {
		setPage(totalPages());
	};

	return {
		page,
		perPage,
		totalPages,
		totalItems,
		setPage,
		setPerPage,
		setTotalItems,
		hasNext,
		hasPrev,
		goToNext,
		goToPrev,
		goToFirst,
		goToLast,
	};
};
