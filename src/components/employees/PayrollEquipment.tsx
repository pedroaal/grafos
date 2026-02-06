import type { Models } from "appwrite";
import dayjs from "dayjs";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Component, For, createResource } from "solid-js";
import type { Part, SetStoreFunction } from "solid-js/store";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import Table from "~/components/core/Table";
import { makeId } from "~/lib/appwrite";
import { listEquipment } from "~/services/employees/equipment";
import type { PayrollEquipment } from "~/types/appwrite";

interface IProps {
	state: EquipmentForm[];
	setState: SetStoreFunction<EquipmentForm[]>;
}

export type EquipmentForm = Omit<
	PayrollEquipment,
	keyof Models.Row | "payrollId" | "equipmentId"
> & { $id: string; equipmentId: string };

const equipmentDefault: EquipmentForm = {
	$id: "",
	deliveryDate: dayjs().format("YYYY-MM-DD"),
	equipmentId: "",
};

const PayrollEquipmentSection: Component<IProps> = (props) => {
	const [equipment] = createResource({}, listEquipment);

	const add = () =>
		props.setState(props.state.length, { ...equipmentDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<EquipmentForm>,
		value: string | number,
	) => {
		props.setState((item) => item.$id === id, col, () => value);
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Equipos Asignados</h6>
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
					{ label: "Equipo" },
					{ label: "Fecha de Entrega" },
				]}
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
							<td>
								<Select
									options={
										equipment()?.rows.map((eq) => ({
											key: eq.$id,
											label: eq.name,
										})) || []
									}
									name="equipmentId"
									value={item.equipmentId || ""}
									onChange={(e) =>
										update(
											item.$id,
											"equipmentId",
											(e.target as HTMLSelectElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="deliveryDate"
									type="date"
									value={item.deliveryDate || ""}
									onInput={(e) =>
										update(
											item.$id,
											"deliveryDate",
											(e.target as HTMLInputElement).value,
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

export default PayrollEquipmentSection;
export { equipmentDefault };
