import type { Models } from "appwrite";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Component, createResource, createSignal, For } from "solid-js";
import type { Part, SetStoreFunction } from "solid-js/store";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Table from "~/components/core/Table";
import { makeId } from "~/lib/appwrite";
import { listProcesses } from "~/services/production/processes";
import type { OrderProcesses } from "~/types/appwrite";
import type { ITotals } from "~/types/orders";
import Select from "../core/Select";

interface IProps {
	state: ProcessForm[];
	setState: SetStoreFunction<ProcessForm[]>;
	totals: ITotals;
	setTotals: SetStoreFunction<ITotals>;
}

export type ProcessForm = Omit<
	OrderProcesses,
	keyof Models.Row | "orderId" | "processId"
> & {
	$id: string;
	processId: string;
};

const processDefault: ProcessForm = {
	$id: "",
	processId: "",
	frontColors: 0,
	backColors: 0,
	thousands: 0,
	unitPrice: 0,
	total: 0,
	done: false,
};

const PrecessesSection: Component<IProps> = (props) => {
	const [processes] = createResource({}, listProcesses);
	const options = () =>
		processes()?.rows.map((process) => ({
			key: process.$id,
			label: process.name,
		})) || [];

	const add = () =>
		props.setState(props.state.length, { ...processDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<ProcessForm>,
		value: string | number | boolean,
	) => {
		props.setState(
			(item) => item.$id === id,
			col,
			() => value,
		);

		const current = props.state.find((item) => item.$id === id);
		props.setState(
			(item) => item.$id === id,
			"total",
			() =>
				+(
					((current?.frontColors || 0) + (current?.backColors || 0)) *
					(current?.thousands || 0) *
					(current?.unitPrice || 0)
				).toFixed(2) || 0,
		);

		props.setTotals((prev) => {
			const total = props.state.reduce(
				(sum, item) => sum + (Number(item.total) || 0),
				0,
			);
			return {
				...prev,
				processes: total,
				balance: total - prev.payments,
			};
		});
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Procesos</h6>
				<button
					type="button"
					class="btn btn-sm btn-ghost"
					onClick={[props.setState, []]}
				>
					<FaSolidTrashCan size={16} />
				</button>
				<button type="button" class="btn btn-sm" onClick={add}>
					<FaSolidPlus size={16} />
				</button>
			</div>
			<Table
				size="xs"
				headers={[
					{ label: "" },
					{ label: "Proceso" },
					{ label: "T", class: "text-center" },
					{ label: "R", class: "text-center" },
					{ label: "Mill", class: "text-center" },
					{ label: "V/U", class: "text-center" },
					{ label: "Total", class: "text-center" },
					{ label: "Terminado", class: "text-center" },
				]}
				footer={
					<tr>
						<td colspan={6} class="text-right font-bold">
							Total Pedido $
						</td>
						<td class="text-center font-bold">
							{props.totals.processes.toFixed(2)}
						</td>
						<td></td>
					</tr>
				}
			>
				<For each={props.state}>
					{(item, idx) => (
						<tr>
							<td class="w-4">
								<button
									type="button"
									class="btn btn-ghost btn-sm"
									onClick={() => remove(idx())}
								>
									<FaSolidXmark size={16} />
								</button>
							</td>
							<td class="w-1/4">
								<Select
									options={options()}
									name="processId"
									value={item.processId || ""}
									onChange={(e) =>
										update(
											item.$id,
											"processId",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="frontColors"
									type="number"
									value={item.frontColors || 0}
									onInput={(e) =>
										update(
											item.$id,
											"frontColors",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="backColors"
									type="number"
									value={item.backColors || 0}
									onInput={(e) =>
										update(
											item.$id,
											"backColors",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="thousands"
									type="number"
									value={item.thousands || 0}
									onInput={(e) =>
										update(
											item.$id,
											"thousands",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="unitPrice"
									type="number"
									step="0.01"
									value={item.unitPrice || 0}
									onInput={(e) =>
										update(
											item.$id,
											"unitPrice",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td class="text-center">{(item.total || 0).toFixed(2)}</td>
							<td class="text-center">
								<Checkbox
									name="done"
									checked={item.done || false}
									onChange={(e) =>
										update(
											item.$id,
											"done",
											(e.target as HTMLInputElement).checked,
										)
									}
								/>
							</td>
						</tr>
					)}
				</For>
			</Table>
		</div>
	);
};

export default PrecessesSection;
