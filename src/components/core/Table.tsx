import type { ParentComponent } from "solid-js";
import { createMemo, For, type JSX, Show } from "solid-js";

interface IHeader {
	label: string;
	class?: string;
}

/**
 * Pagination props for the Table component
 */
interface IPaginationProps {
	/** Current page number (1-based) */
	page: number;
	/** Total number of pages */
	totalPages: number;
	/** Total number of items across all pages */
	totalItems: number;
	/** Items per page */
	perPage: number;
	/** Callback when page changes */
	onPageChange: (page: number) => void;
	/** Optional callback when per-page changes */
	onPerPageChange?: (perPage: number) => void;
}

interface IProps {
	headers: Array<IHeader>;
	footer?: JSX.Element;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Optional pagination configuration */
	pagination?: IPaginationProps;
}

const Table: ParentComponent<IProps> = (props) => {
	// Generate windowed page numbers with ellipsis
	const pageNumbers = createMemo(() => {
		const pagination = props.pagination;
		if (!pagination) return [];

		const { page, totalPages } = pagination;
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			// Determine range around current page
			let startPage = Math.max(2, page - 1);
			let endPage = Math.min(totalPages - 1, page + 1);

			// Adjust if near start
			if (page <= 3) {
				startPage = 2;
				endPage = 4;
			}

			// Adjust if near end
			if (page >= totalPages - 2) {
				startPage = totalPages - 3;
				endPage = totalPages - 1;
			}

			// Add ellipsis or pages before current
			if (startPage > 2) {
				pages.push("...");
			}

			// Add pages in the range
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Add ellipsis or pages after current
			if (endPage < totalPages - 1) {
				pages.push("...");
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	});

	return (
		<div>
			<div class="overflow-x-auto">
				<table
					class="table table-zebra w-full"
					classList={{
						"table-xs": props.size === "xs",
						"table-sm": props.size === "sm",
						"table-md": !props.size || props.size === "md",
						"table-lg": props.size === "lg",
						"table-xl": props.size === "xl",
					}}
				>
					<thead>
						<tr>
							<For each={props.headers}>
								{(item) => <th class={item.class}>{item.label}</th>}
							</For>
						</tr>
					</thead>
					<tbody>{props.children}</tbody>
					<Show when={props.footer}>
						<tfoot>{props.footer}</tfoot>
					</Show>
				</table>
			</div>

			{/* Pagination section */}
			<Show when={props.pagination && props.pagination.totalPages > 1}>
				<div class="flex items-center justify-between mt-4 flex-wrap gap-2">
					<div class="text-sm">
						Página {props.pagination?.page} de {props.pagination?.totalPages} (
						{props.pagination?.totalItems} items)
					</div>

					<div class="join">
						{/* First button */}
						<button
							type="button"
							class="join-item btn btn-sm btn-outline"
							classList={{
								"btn-disabled": props.pagination?.page === 1,
							}}
							disabled={props.pagination?.page === 1}
							onClick={() => props.pagination?.onPageChange(1)}
						>
							Primera
						</button>

						{/* Previous button */}
						<button
							type="button"
							class="join-item btn btn-sm btn-outline"
							classList={{
								"btn-disabled": props.pagination?.page === 1,
							}}
							disabled={props.pagination?.page === 1}
							onClick={() =>
								props.pagination?.onPageChange(
									(props.pagination?.page || 1) - 1,
								)
							}
						>
							Anterior
						</button>

						{/* Page numbers */}
						<For each={pageNumbers()}>
							{(pageNum) =>
								typeof pageNum === "number" ? (
									<button
										type="button"
										class="join-item btn btn-sm btn-outline"
										classList={{
											"btn-active": props.pagination?.page === pageNum,
										}}
										onClick={() => props.pagination?.onPageChange(pageNum)}
									>
										{pageNum}
									</button>
								) : (
									<button
										type="button"
										class="join-item btn btn-sm btn-outline btn-disabled"
										disabled
									>
										{pageNum}
									</button>
								)
							}
						</For>

						{/* Next button */}
						<button
							type="button"
							class="join-item btn btn-sm btn-outline"
							classList={{
								"btn-disabled":
									props.pagination?.page === props.pagination?.totalPages,
							}}
							disabled={props.pagination?.page === props.pagination?.totalPages}
							onClick={() =>
								props.pagination?.onPageChange(
									(props.pagination?.page || 1) + 1,
								)
							}
						>
							Siguiente
						</button>

						{/* Last button */}
						<button
							type="button"
							class="join-item btn btn-sm btn-outline"
							classList={{
								"btn-disabled":
									props.pagination?.page === props.pagination?.totalPages,
							}}
							disabled={props.pagination?.page === props.pagination?.totalPages}
							onClick={() =>
								props.pagination?.onPageChange(
									props.pagination?.totalPages || 1,
								)
							}
						>
							Última
						</button>
					</div>
				</div>
			</Show>
		</div>
	);
};

export default Table;
