import { createSignal, createMemo, type Accessor } from "solid-js";

export interface IPaginationOptions {
	initialPage?: number;
	initialPerPage?: number;
	initialTotalItems?: number;
}

export interface IPagination {
	page: Accessor<number>;
	perPage: Accessor<number>;
	totalItems: Accessor<number>;
	totalPages: Accessor<number>;
	hasNext: Accessor<boolean>;
	hasPrev: Accessor<boolean>;
	isFirstPage: Accessor<boolean>;
	isLastPage: Accessor<boolean>;
	setPage: (page: number) => void;
	setPerPage: (perPage: number) => void;
	setTotalItems: (totalItems: number) => void;
	goToNext: () => void;
	goToPrev: () => void;
	goToFirst: () => void;
	goToLast: () => void;
}

export const usePagination = (
	options: IPaginationOptions = {},
): IPagination => {
	const {
		initialPage = 1,
		initialPerPage = 10,
		initialTotalItems = 0,
	} = options;

	const [page, setPage] = createSignal<number>(initialPage);
	const [perPage, setPerPage] = createSignal<number>(initialPerPage);
	const [totalItems, setTotalItems] = createSignal<number>(initialTotalItems);

	const totalPages = createMemo(() => Math.ceil(totalItems() / perPage()) || 1);

	const hasNext = createMemo(() => page() < totalPages());

	const hasPrev = createMemo(() => page() > 1);

	const isFirstPage = createMemo(() => page() === 1);

	const isLastPage = createMemo(() => page() >= totalPages());

	const goToNext = (): void => {
		if (hasNext()) {
			setPage(page() + 1);
		}
	};

	const goToPrev = (): void => {
		if (hasPrev()) {
			setPage(page() - 1);
		}
	};

	const goToFirst = (): void => {
		setPage(1);
	};

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
