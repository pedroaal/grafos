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
	PayrollEducation,
	PayrollEducationEducationLevel,
} from "~/types/appwrite";

interface IProps {
	state: EducationForm[];
	setState: SetStoreFunction<EducationForm[]>;
}

export type EducationForm = Omit<
	PayrollEducation,
	keyof Models.Row | "payrollId"
> & { $id: string };

const educationDefault: EducationForm = {
	$id: "",
	educationLevel: "primary" as PayrollEducationEducationLevel,
	institutionName: "",
	startDate: dayjs().format("YYYY-MM-DD"),
	endDate: dayjs().format("YYYY-MM-DD"),
	degree: "",
};

const PayrollEducationSection: Component<IProps> = (props) => {
	const educationLevels = [
		{ key: "primary", label: "Primaria" },
		{ key: "secondary", label: "Secundaria" },
		{ key: "post-secondary", label: "Post-secundaria" },
		{ key: "tertiary", label: "Terciaria" },
		{ key: "other", label: "Otro" },
	];

	const add = () =>
		props.setState(props.state.length, { ...educationDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<EducationForm>,
		value: string | number,
	) => {
		props.setState((item) => item.$id === id, col, () => value);
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Educación</h6>
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
					{ label: "Nivel" },
					{ label: "Institución" },
					{ label: "Fecha Inicio" },
					{ label: "Fecha Fin" },
					{ label: "Título/Grado" },
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
									options={educationLevels}
									name="educationLevel"
									value={item.educationLevel || ""}
									onChange={(e) =>
										update(
											item.$id,
											"educationLevel",
											(e.target as HTMLSelectElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="institutionName"
									type="text"
									value={item.institutionName || ""}
									onInput={(e) =>
										update(
											item.$id,
											"institutionName",
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
											(e.target as HTMLInputElement).value,
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
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="degree"
									type="text"
									value={item.degree || ""}
									onInput={(e) =>
										update(
											item.$id,
											"degree",
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

export default PayrollEducationSection;
export { educationDefault };
