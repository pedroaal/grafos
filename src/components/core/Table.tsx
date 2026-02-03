import type { ParentComponent } from "solid-js";
import { For, type JSX, Show, createMemo } from "solid-js";

interface IHeader {
	label: string;
	class?: string;
}

interface IPaginationProps {

	page: number;

	totalPages: number;

	totalItems: number;

	perPage: number;

	onPageChange: (page: number) => void;

	onPerPageChange?: (perPage: number) => void;
}

interface IProps {
	headers: Array<IHeader>;
	footer?: JSX.Element;
	size?: "xs" | "sm" | "md" | "lg" | "xl";

	pagination?: IPaginationProps;
}

const Table: ParentComponent<IProps> = (props) => {

	const pageNumbers = createMemo(() => {
		const pagination = props.pagination;
		if (!pagination) return [];

		const { page, totalPages } = pagination;
		const pages: Array<number | "ellipsis"> = [];

		if (totalPages <= 7) {

			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {

			pages.push(1);

			if (page > 3) {
				pages.push("ellipsis");
			}

			const start = Math.max(2, page - 1);
			const end = Math.min(totalPages - 1, page + 1);
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (page < totalPages - 2) {
				pages.push("ellipsis");
			}

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

			<Show when={props.pagination && props.pagination.totalPages > 1}>
				{(p) => (
					<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">

						<div class="text-sm">
							Página {p().page} de {p().totalPages}
							<span class="text-base-content/60 ml-2">
								({p().totalItems} total)
							</span>
						</div>

						<div class="join">

							<button
								type="button"
								class="join-item btn btn-sm"
								classList={{
									"btn-disabled": p().page === 1,
								}}
								disabled={p().page === 1}
								onClick={() => p().onPageChange(1)}
							>
								Primera
							</button>

							<button
								type="button"
								class="join-item btn btn-sm"
								classList={{
									"btn-disabled": p().page === 1,
								}}
								disabled={p().page === 1}
								onClick={() => p().onPageChange(p().page - 1)}
							>
								Anterior
							</button>

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
												"btn-active": p().page === pageNum,
											}}
											onClick={() => p().onPageChange(pageNum as number)}
										>
											{pageNum}
										</button>
									</Show>
								)}
							</For>

							<button
								type="button"
								class="join-item btn btn-sm"
								classList={{
									"btn-disabled": p().page === p().totalPages,
								}}
								disabled={p().page === p().totalPages}
								onClick={() => p().onPageChange(p().page + 1)}
							>
								Siguiente
							</button>

							<button
								type="button"
								class="join-item btn btn-sm"
								classList={{
									"btn-disabled": p().page === p().totalPages,
								}}
								disabled={p().page === p().totalPages}
								onClick={() => p().onPageChange(p().totalPages)}
							>
								Última
							</button>
						</div>
					</div>
				)}
			</Show>
		</>
	);
};

export default Table;
