import {
	FaSolidAngleLeft,
	FaSolidAngleRight,
	FaSolidAnglesLeft,
	FaSolidAnglesRight,
} from "solid-icons/fa";
import { type Component, createMemo, For, Show } from "solid-js";
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
		const pages: Array<number> = [];
		const windowSize = 5;

		if (totalPages <= windowSize) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
			return pages;
		}

		let start = page - Math.floor(windowSize / 2);
		let end = page + Math.floor(windowSize / 2);

		if (start < 1) {
			start = 1;
			end = windowSize;
		}

		if (end > totalPages) {
			end = totalPages;
			start = totalPages - windowSize + 1;
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	});

	return (
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
			<div class="text-sm">
				Página {props.page} de {props.totalPages}
				<span class="text-base-content/60 ml-2">
					({props.totalItems} total)
				</span>
			</div>

			<Show when={props.totalPages > 1}>
				<div class="join">
					<button
						type="button"
						class="join-item btn btn-square btn-sm"
						classList={{
							"btn-disabled": props.page === 1,
						}}
						disabled={props.page === 1}
						onClick={() => props.onPageChange(1)}
					>
						<FaSolidAnglesLeft size={16} />
					</button>

					<button
						type="button"
						class="join-item btn btn-square btn-sm"
						classList={{
							"btn-disabled": props.page === 1,
						}}
						disabled={props.page === 1}
						onClick={() => props.onPageChange(props.page - 1)}
					>
						<FaSolidAngleLeft size={16} />
					</button>

					<For each={pageNumbers()}>
						{(pageNum) => (
							<button
								type="button"
								class="join-item btn btn-sm"
								classList={{
									"btn-active": props.page === pageNum,
								}}
								onClick={() => props.onPageChange(pageNum)}
							>
								{pageNum}
							</button>
						)}
					</For>

					<button
						type="button"
						class="join-item btn btn-square btn-sm"
						classList={{
							"btn-disabled": props.page === props.totalPages,
						}}
						disabled={props.page === props.totalPages}
						onClick={() => props.onPageChange(props.page + 1)}
					>
						<FaSolidAngleRight size={16} />
					</button>

					<button
						type="button"
						class="join-item btn btn-square btn-sm"
						classList={{
							"btn-disabled": props.page === props.totalPages,
						}}
						disabled={props.page === props.totalPages}
						onClick={() => props.onPageChange(props.totalPages)}
					>
						<FaSolidAnglesRight size={16} />
					</button>
				</div>
			</Show>
		</div>
	);
};

export default Pagination;
