import { For, Show, createMemo, type Component } from "solid-js";

export interface IPaginationProps {
	page: number;
	totalPages: number;
	totalItems: number;
	perPage: number;
	onPageChange: (page: number) => void;
	onPerPageChange?: (perPage: number) => void;
}

const Pagination: Component<IPaginationProps> = (props) => {
	const pageNumbers = createMemo(() => {
		const { page, totalPages } = props;
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
		<Show when={props.totalPages > 1}>
			<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
				<div class="text-sm">
					Página {props.page} de {props.totalPages}
					<span class="text-base-content/60 ml-2">
						({props.totalItems} total)
					</span>
				</div>

				<div class="join">
					<button
						type="button"
						class="join-item btn btn-sm"
						classList={{
							"btn-disabled": props.page === 1,
						}}
						disabled={props.page === 1}
						onClick={() => props.onPageChange(1)}
					>
						Primera
					</button>

					<button
						type="button"
						class="join-item btn btn-sm"
						classList={{
							"btn-disabled": props.page === 1,
						}}
						disabled={props.page === 1}
						onClick={() => props.onPageChange(props.page - 1)}
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
										"btn-active": props.page === pageNum,
									}}
									onClick={() => props.onPageChange(pageNum as number)}
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
							"btn-disabled": props.page === props.totalPages,
						}}
						disabled={props.page === props.totalPages}
						onClick={() => props.onPageChange(props.page + 1)}
					>
						Siguiente
					</button>

					<button
						type="button"
						class="join-item btn btn-sm"
						classList={{
							"btn-disabled": props.page === props.totalPages,
						}}
						disabled={props.page === props.totalPages}
						onClick={() => props.onPageChange(props.totalPages)}
					>
						Última
					</button>
				</div>
			</div>
		</Show>
	);
};

export default Pagination;
