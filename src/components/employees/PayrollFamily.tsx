import type { Models } from "appwrite";
import dayjs from "dayjs";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Component, For } from "solid-js";
import type { Part, SetStoreFunction } from "solid-js/store";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import Table from "~/components/core/Table";
import { makeId } from "~/lib/appwrite";
import type {
	PayrollFamily,
	PayrollFamilyRelationship,
} from "~/types/appwrite";

interface IProps {
	state: FamilyForm[];
	setState: SetStoreFunction<FamilyForm[]>;
}

export type FamilyForm = Omit<
	PayrollFamily,
	keyof Models.Row | "payrollId"
> & { $id: string };

const familyDefault: FamilyForm = {
	$id: "",
	relationship: "parent" as PayrollFamilyRelationship,
	name: "",
	birthDate: dayjs().format("YYYY-MM-DD"),
	occupation: null,
	phone: null,
	mobile: null,
};

const PayrollFamilySection: Component<IProps> = (props) => {
	const relationships = [
		{ key: "parent", label: "Padre/Madre" },
		{ key: "spouse", label: "Cónyuge" },
		{ key: "child", label: "Hijo/a" },
		{ key: "other", label: "Otro" },
	];

	const add = () =>
		props.setState(props.state.length, { ...familyDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<FamilyForm>,
		value: string | number | null,
	) => {
		props.setState((item) => item.$id === id, col, () => value);
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Familia</h6>
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
					{ label: "Relación" },
					{ label: "Nombre" },
					{ label: "Fecha Nacimiento" },
					{ label: "Ocupación" },
					{ label: "Teléfono" },
					{ label: "Celular" },
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
									options={relationships}
									name="relationship"
									value={item.relationship || ""}
									onChange={(e) =>
										update(
											item.$id,
											"relationship",
											(e.target as HTMLSelectElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="name"
									type="text"
									value={item.name || ""}
									onInput={(e) =>
										update(
											item.$id,
											"name",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="birthDate"
									type="date"
									value={item.birthDate || ""}
									onInput={(e) =>
										update(
											item.$id,
											"birthDate",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="occupation"
									type="text"
									value={item.occupation || ""}
									onInput={(e) =>
										update(
											item.$id,
											"occupation",
											(e.target as HTMLInputElement).value || null,
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
											(e.target as HTMLInputElement).value || null,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="mobile"
									type="text"
									value={item.mobile || ""}
									onInput={(e) =>
										update(
											item.$id,
											"mobile",
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

export default PayrollFamilySection;
export { familyDefault };
