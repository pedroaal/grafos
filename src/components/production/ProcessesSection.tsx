import type { Models } from "appwrite";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import {
	type Accessor,
	type Component,
	createResource,
	For,
	type Setter,
} from "solid-js";
import { produce } from "solid-js/store";

import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Table from "~/components/core/Table";
import { listProcesses } from "~/services/production/processes";

import type { OrderProcesses } from "~/types/appwrite";
import Select from "../core/Select";

interface IProps {
	state: Accessor<Array<ProcessForm>>;
	setState: Setter<Array<ProcessForm>>;
}

export type ProcessForm = Omit<
	OrderProcesses,
	keyof Models.Row | "orderId" | "processId"
> & {
	processId: string;
};

const processDefault: ProcessForm = {
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

	const add = (current?: Partial<ProcessForm>) =>
		props.setState((prev) => [
			...prev,
			{
				...processDefault,
				...current,
			},
		]);

	const update = (idx: number, patch: Partial<ProcessForm>) =>
		props.setState(
			produce((prev) => {
				const {frontColors, backColors, thousands, unitPrice} = {...prev[idx], ...patch}
				const total =
					+((frontColors + backColors) * thousands * unitPrice).toFixed(2) || 0;
				Object.assign(prev[idx], patch, { total });
			}),
		);

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	const total = () =>
		props.state().reduce((sum, item) => sum + (Number(item.total) || 0), 0);

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
				<button type="button" class="btn btn-sm" onClick={[add, {}]}>
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
						<td class="text-center font-bold">{total().toFixed(4)}</td>
						<td></td>
					</tr>
				}
			>
				<For each={props.state()}>
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
										update(idx(), {
											processId: (e.target as HTMLInputElement).value,
										})
									}
								/>
							</td>
							<td>
								<Input
									name="frontColors"
									type="number"
									value={item.frontColors || 0}
									onInput={(e) =>
										update(idx(), {
											frontColors: Number((e.target as HTMLInputElement).value),
										})
									}
								/>
							</td>
							<td>
								<Input
									name="backColors"
									type="number"
									value={item.backColors || 0}
									onInput={(e) =>
										update(idx(), {
											backColors: Number((e.target as HTMLInputElement).value),
										})
									}
								/>
							</td>
							<td>
								<Input
									name="thousands"
									type="number"
									value={item.thousands || 0}
									onInput={(e) =>
										update(idx(), {
											thousands: Number((e.target as HTMLInputElement).value),
										})
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
										update(idx(), {
											unitPrice: Number((e.target as HTMLInputElement).value),
										})
									}
								/>
							</td>
							<td class="text-center">{(item.total || 0).toFixed(4)}</td>
							<td class="text-center">
								<Checkbox
									name="done"
									checked={item.done || false}
									onChange={(e) =>
										update(idx(), {
											done: (e.target as HTMLInputElement).checked,
										})
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
