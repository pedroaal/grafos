import type { Models } from "appwrite";
import dayjs from "dayjs";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Component, For } from "solid-js";
import type { Part, SetStoreFunction } from "solid-js/store";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Table from "~/components/core/Table";
import { makeId } from "~/lib/appwrite";
import type { PayrollReferences } from "~/types/appwrite";

interface IProps {
	state: ReferenceForm[];
	setState: SetStoreFunction<ReferenceForm[]>;
}

export type ReferenceForm = Omit<
	PayrollReferences,
	keyof Models.Row | "payrollId"
> & { $id: string };

const referenceDefault: ReferenceForm = {
	$id: "",
	referenceType: false,
	companyName: null,
	contactName: "",
	phone: "",
	relationship: "",
	startDate: null,
	endDate: null,
	position: null,
	separationReason: null,
};

const PayrollReferencesSection: Component<IProps> = (props) => {
	const add = () =>
		props.setState(props.state.length, { ...referenceDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<ReferenceForm>,
		value: string | boolean | null,
	) => {
		props.setState((item) => item.$id === id, col, () => value);
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Referencias</h6>
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
					{ label: "Laboral" },
					{ label: "Empresa" },
					{ label: "Contacto" },
					{ label: "Teléfono" },
					{ label: "Relación" },
					{ label: "Fecha Inicio" },
					{ label: "Fecha Fin" },
					{ label: "Cargo" },
					{ label: "Razón Separación" },
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
							<td class="text-center">
								<input
									type="checkbox"
									class="checkbox checkbox-sm"
									checked={item.referenceType}
									onChange={(e) =>
										update(
											item.$id,
											"referenceType",
											(e.target as HTMLInputElement).checked,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="companyName"
									type="text"
									value={item.companyName || ""}
									onInput={(e) =>
										update(
											item.$id,
											"companyName",
											(e.target as HTMLInputElement).value || null,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="contactName"
									type="text"
									value={item.contactName || ""}
									onInput={(e) =>
										update(
											item.$id,
											"contactName",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="phone"
									type="text"
									value={item.phone || ""}
									onInput={(e) =>
										update(
											item.$id,
											"phone",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="relationship"
									type="text"
									value={item.relationship || ""}
									onInput={(e) =>
										update(
											item.$id,
											"relationship",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="startDate"
									type="date"
									value={item.startDate || ""}
									onInput={(e) =>
										update(
											item.$id,
											"startDate",
											(e.target as HTMLInputElement).value || null,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="endDate"
									type="date"
									value={item.endDate || ""}
									onInput={(e) =>
										update(
											item.$id,
											"endDate",
											(e.target as HTMLInputElement).value || null,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="position"
									type="text"
									value={item.position || ""}
									onInput={(e) =>
										update(
											item.$id,
											"position",
											(e.target as HTMLInputElement).value || null,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="separationReason"
									type="text"
									value={item.separationReason || ""}
									onInput={(e) =>
										update(
											item.$id,
											"separationReason",
											(e.target as HTMLInputElement).value || null,
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

export default PayrollReferencesSection;
export { referenceDefault };
