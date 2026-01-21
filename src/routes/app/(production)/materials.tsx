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
import {
	deleteCategory,
	listCategories,
} from "~/services/production/categories";
import { deleteMaterial, listMaterials } from "~/services/production/materials";

const MaterialsPage = () => {
	const { addAlert, openModal } = useApp();

	const [categories, { refetch: refetchCategories }] = createResource(
		{},
		listCategories,
	);
	const [materials, { refetch: refetchMaterials }] = createResource(
		{},
		listMaterials,
	);

	const editRow = (modalId: string, id: string) => {
		openModal(modalId, { id });
	};

	const handleCategoryDelete = async (categoryId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la categoría "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteCategory(categoryId);
			addAlert({ type: "success", message: "Categoría eliminada con éxito" });
			refetchCategories();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar categoría",
			});
		}
	};

	const handleMaterialDelete = async (materialId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el material "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteMaterial(materialId);
			addAlert({ type: "success", message: "Material eliminado con éxito" });
			refetchMaterials();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar material",
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
											onDelete={() => handleCategoryDelete(item.$id, item.name)}
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
											onEdit={() => editRow(Modals.Material, item.$id)}
											onDelete={() => handleMaterialDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<CategoryModal onSuccess={() => refetchCategories()} />
				<MaterialModal onSuccess={() => refetchMaterials()} />
			</DashboardLayout>
		</>
	);
};

export default MaterialsPage;
