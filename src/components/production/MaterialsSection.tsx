import type { Models } from "appwrite";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Component, createResource, For } from "solid-js";
import type { Part, SetStoreFunction } from "solid-js/store";
import Input from "~/components/core/Input";
import Table from "~/components/core/Table";
import { makeId } from "~/lib/appwrite";
import { listMaterials } from "~/services/production/materials";
import { listSuppliers } from "~/services/production/suppliers";
import type { OrderMaterials } from "~/types/appwrite";
import type { ITotals } from "~/types/orders";
import Select from "../core/Select";

interface IProps {
	state: MaterialForm[];
	setState: SetStoreFunction<MaterialForm[]>;
	totals: ITotals;
	setTotals: SetStoreFunction<ITotals>;
}

export type MaterialForm = Omit<
	OrderMaterials,
	keyof Models.Row | "orderId" | "materialId" | "supplierId"
> & { $id: string; materialId: string; supplierId: string };

const materialDefault: MaterialForm = {
	$id: "",
	materialId: "",
	quantity: 0,
	cutHeight: 0,
	cutWidth: 0,
	sizes: 0,
	supplierId: "",
	invoiceNumber: null,
	total: 0,
};

const MaterialsSection: Component<IProps> = (props) => {
	const [materials] = createResource({}, listMaterials);
	const [suppliers] = createResource({}, listSuppliers);
	const options = () =>
		materials()?.rows.map((material) => ({
			key: material.$id,
			label: material.name,
		})) || [];
	const supplierOptions = () =>
		suppliers()?.rows.map((supplier) => ({
			key: supplier.$id,
			label: supplier.name,
		})) || [];

	const add = () =>
		props.setState(props.state.length, { ...materialDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<MaterialForm>,
		value: string | number | null,
	) => {
		props.setState(
			(item) => item.$id === id,
			col,
			() => value,
		);

		props.setTotals((prev) => ({
			...prev,
			materials: props.state.reduce(
				(sum, item) => sum + (Number(item.total) || 0),
				0,
			),
		}));
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Materiales</h6>
				<button type="button" class="btn btn-sm" onClick={[props.setState, []]}>
					<FaSolidTrashCan size={16} />
				</button>
				<button type="button" class="btn btn-sm btn-ghost" onClick={add}>
					<FaSolidPlus size={16} />
				</button>
			</div>
			<Table
				size="xs"
				headers={[
					{ label: "" },
					{ label: "Material" },
					{ label: "Cantidad", class: "text-center" },
					{ label: "Corte A", class: "text-center" },
					{ label: "Corte An", class: "text-center" },
					{ label: "Tamaños", class: "text-center" },
					{ label: "Proveedor", class: "text-center" },
					{ label: "Factura", class: "text-center" },
					{ label: "Total", class: "text-center" },
				]}
				footer={
					<tr>
						<td colspan={8} class="text-right font-bold">
							Total material $
						</td>
						<td class="text-center font-bold">
							{props.totals.materials.toFixed(2)}
						</td>
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
									name="materialId"
									options={options()}
									value={item.materialId || ""}
									onChange={(e) =>
										update(
											item.$id,
											"materialId",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="quantity"
									type="number"
									value={item.quantity || 0}
									onInput={(e) =>
										update(
											item.$id,
											"quantity",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="cutHeight"
									type="number"
									step="0.1"
									value={item.cutHeight || 0}
									onInput={(e) =>
										update(
											item.$id,
											"cutHeight",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="cutWidth"
									type="number"
									step="0.1"
									value={item.cutWidth || 0}
									onInput={(e) =>
										update(
											item.$id,
											"cutWidth",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="sizes"
									type="number"
									value={item.sizes || 0}
									onInput={(e) =>
										update(
											item.$id,
											"sizes",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Select
									name="supplierId"
									options={supplierOptions()}
									value={item.supplierId || ""}
									onChange={(e) =>
										update(
											item.$id,
											"supplierId",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="invoiceNumber"
									type="number"
									value={item.invoiceNumber || 0}
									onInput={(e) =>
										update(
											item.$id,
											"invoiceNumber",
											Number((e.target as HTMLInputElement).value),
										)
									}
								/>
							</td>
							<td>
								<Input
									name="total"
									type="number"
									step="0.01"
									value={item.total || 0}
									onInput={(e) => {
										update(
											item.$id,
											"total",
											Number((e.target as HTMLInputElement).value),
										);
									}}
								/>
							</td>
						</tr>
					)}
				</For>
			</Table>
		</div>
	);
};

export default MaterialsSection;
