import type { ParentComponent } from "solid-js";
import { For, type JSX, Show, createMemo } from "solid-js";

interface IHeader {
	label: string;
	class?: string;
}

/**
 * Pagination props for the Table component
 */
interface IPaginationProps {
	/** Current page number (1-indexed) */
	page: number;
	/** Total number of pages */
	totalPages: number;
	/** Total number of items */
	totalItems: number;
	/** Number of items per page */
	perPage: number;
	/** Callback when page changes */
	onPageChange: (page: number) => void;
	/** Optional callback when per-page value changes */
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
	/**
	 * Generate page numbers with ellipsis for large page counts
	 * Shows: [1] ... [current-1] [current] [current+1] ... [last]
	 */
	const pageNumbers = createMemo(() => {
		const pagination = props.pagination;
		if (!pagination) return [];

		const { page, totalPages } = pagination;
		const pages: Array<number | "ellipsis"> = [];

		if (totalPages <= 7) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			// Show ellipsis if current page is far from start
			if (page > 3) {
				pages.push("ellipsis");
			}

			// Show pages around current page
			const start = Math.max(2, page - 1);
			const end = Math.min(totalPages - 1, page + 1);
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			// Show ellipsis if current page is far from end
			if (page < totalPages - 2) {
				pages.push("ellipsis");
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	});

	return (
		<>
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

			{/* Pagination Section */}
			<Show when={props.pagination && props.pagination.totalPages > 1}>
				<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
					{/* Page info */}
					<div class="text-sm">
						Página {props.pagination?.page} de {props.pagination?.totalPages}
						<span class="text-base-content/60 ml-2">
							({props.pagination?.totalItems} total)
						</span>
					</div>

					{/* Pagination controls */}
					<div class="join">
						{/* First button */}
						<button
							type="button"
							class="join-item btn btn-sm"
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
							class="join-item btn btn-sm"
							classList={{
								"btn-disabled": props.pagination?.page === 1,
							}}
							disabled={props.pagination?.page === 1}
							onClick={() =>
								props.pagination?.onPageChange(props.pagination.page - 1)
							}
						>
							Anterior
						</button>

						{/* Page numbers */}
						<For each={pageNumbers()}>
							{(pageNum) => (
								<Show
									when={pageNum !== "ellipsis"}
									fallback={
										<button
											type="button"
											class="join-item btn btn-sm btn-disabled"
											disabled
										>
											...
										</button>
									}
								>
									<button
										type="button"
										class="join-item btn btn-sm"
										classList={{
											"btn-active": props.pagination?.page === pageNum,
										}}
										onClick={() =>
											props.pagination?.onPageChange(pageNum as number)
										}
									>
										{pageNum}
									</button>
								</Show>
							)}
						</For>

						{/* Next button */}
						<button
							type="button"
							class="join-item btn btn-sm"
							classList={{
								"btn-disabled":
									props.pagination?.page === props.pagination?.totalPages,
							}}
							disabled={props.pagination?.page === props.pagination?.totalPages}
							onClick={() =>
								props.pagination?.onPageChange(props.pagination.page + 1)
							}
						>
							Siguiente
						</button>

						{/* Last button */}
						<button
							type="button"
							class="join-item btn btn-sm"
							classList={{
								"btn-disabled":
									props.pagination?.page === props.pagination?.totalPages,
							}}
							disabled={props.pagination?.page === props.pagination?.totalPages}
							onClick={() =>
								props.pagination?.onPageChange(props.pagination.totalPages)
							}
						>
							Última
						</button>
					</div>
				</div>
			</Show>
		</>
	);
};

export default Table;
