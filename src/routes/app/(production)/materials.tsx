import { Title } from "@solidjs/meta";
import { createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";
import DashboardLayout from "~/components/layout/Dashboard";
import CategoryModal from "~/components/production/CategoryModal";
import MaterialModal from "~/components/production/MaterialModal";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { listCategories } from "~/services/production/categories";
import { listMaterials } from "~/services/production/materials";
import { deleteOrder } from "~/services/production/orders";

const ConfigPage = () => {
	const { addAlert, openModal } = useApp();

	const [categories, { refetchCategories }] = createResource(
		{},
		listCategories,
	);
	const [materials, { refetchMaterials }] = createResource({}, listMaterials);

	const editRow = (modalId: string, id: string) => {
		openModal(modalId, { id });
	};

	const handleDelete = async (orderId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la orden "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteOrder(orderId);
			addAlert({ type: "success", message: "Orden eliminada con éxito" });
			// refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar orden",
			});
		}
	};

	return (
		<>
			<Title>Materiales - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[{ label: "Produccion" }, { label: "Materiales" }]}
				/>
				<BlueBoard
					title="Categorias"
					modals={[
						{
							key: Modals.Category,
							label: "Nueva Categoria",
						},
					]}
				>
					<Table
						headers={[{ label: "Nombre" }, { label: "", class: "w-1/12" }]}
					>
						<For each={categories()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.name}</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Category, item.$id)}
											onDelete={() => handleDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<BlueBoard
					title="Materiales"
					modals={[
						{
							key: Modals.Material,
							label: "Nuevo Material",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Categoria" },
							{ label: "Nombre" },
							{ label: "Color" },
							{ label: "Alto" },
							{ label: "Ancho" },
							{ label: "Precio" },
							{ label: "UV" },
							{ label: "Laminado" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={materials()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.categoryId?.name || ""}</td>
									<td>{item.name}</td>
									<td>
										<TrueFalse value={item.hasColor} />
									</td>
									<td>{item.height}</td>
									<td>{item.width}</td>
									<td>{item.price}</td>
									<td>
										<TrueFalse value={item.hasUv} />
									</td>
									<td>
										<TrueFalse value={item.hasLaminated} />
									</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Process, item.$id)}
											onDelete={() => handleDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<CategoryModal />
				<MaterialModal />
			</DashboardLayout>
		</>
	);
};

export default ConfigPage;
