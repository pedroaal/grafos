import { createSignal, createMemo, type Accessor } from "solid-js";

/**
 * Options for configuring the usePagination hook
 */
export interface UsePaginationOptions {
	/** Initial page number (1-indexed). Default: 1 */
	initialPage?: number;
	/** Initial items per page. Default: 10 */
	initialPerPage?: number;
	/** Initial total items count. Default: 0 */
	initialTotalItems?: number;
}

/**
 * Return type for the usePagination hook
 */
export interface UsePaginationReturn {
	/** Current page number (1-indexed) */
	page: Accessor<number>;
	/** Items per page */
	perPage: Accessor<number>;
	/** Total number of items */
	totalItems: Accessor<number>;
	/** Total number of pages (derived) */
	totalPages: Accessor<number>;
	/** Whether there is a next page */
	hasNext: Accessor<boolean>;
	/** Whether there is a previous page */
	hasPrev: Accessor<boolean>;
	/** Whether on the first page */
	isFirstPage: Accessor<boolean>;
	/** Whether on the last page */
	isLastPage: Accessor<boolean>;
	/** Set the current page */
	setPage: (page: number) => void;
	/** Set items per page */
	setPerPage: (perPage: number) => void;
	/** Set total items count */
	setTotalItems: (totalItems: number) => void;
	/** Go to the next page */
	goToNext: () => void;
	/** Go to the previous page */
	goToPrev: () => void;
	/** Go to the first page */
	goToFirst: () => void;
	/** Go to the last page */
	goToLast: () => void;
}

/**
 * Custom hook for managing pagination state and logic
 *
 * @param options - Optional configuration for initial pagination state
 * @returns Object containing pagination state, derived values, and actions
 *
 * @example
 * ```tsx
 * const pagination = usePagination({ initialPerPage: 20 });
 *
 * // Set total items from API response
 * pagination.setTotalItems(response.total);
 *
 * // Navigate pages
 * pagination.goToNext();
 * pagination.goToFirst();
 *
 * // Use in queries
 * const offset = (pagination.page() - 1) * pagination.perPage();
 * ```
 */
export const usePagination = (
	options: UsePaginationOptions = {},
): UsePaginationReturn => {
	const { initialPage = 1, initialPerPage = 10, initialTotalItems = 0 } = options;

	const [page, setPage] = createSignal<number>(initialPage);
	const [perPage, setPerPage] = createSignal<number>(initialPerPage);
	const [totalItems, setTotalItems] = createSignal<number>(initialTotalItems);

	// Derived: total pages
	const totalPages = createMemo(() =>
		Math.ceil(totalItems() / perPage()) || 1,
	);

	// Derived: has next page
	const hasNext = createMemo(() => page() < totalPages());

	// Derived: has previous page
	const hasPrev = createMemo(() => page() > 1);

	// Derived: is first page
	const isFirstPage = createMemo(() => page() === 1);

	// Derived: is last page
	const isLastPage = createMemo(() => page() >= totalPages());

	// Action: go to next page
	const goToNext = (): void => {
		if (hasNext()) {
			setPage(page() + 1);
		}
	};

	// Action: go to previous page
	const goToPrev = (): void => {
		if (hasPrev()) {
			setPage(page() - 1);
		}
	};

	// Action: go to first page
	const goToFirst = (): void => {
		setPage(1);
	};

	// Action: go to last page
	const goToLast = (): void => {
		setPage(totalPages());
	};

	return {
		page,
		perPage,
		totalItems,
		totalPages,
		hasNext,
		hasPrev,
		isFirstPage,
		isLastPage,
		setPage,
		setPerPage,
		setTotalItems,
		goToNext,
		goToPrev,
		goToFirst,
		goToLast,
	};
};
