import { Title } from "@solidjs/meta";
import { createResource, For, createEffect } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";
import DashboardLayout from "~/components/layouts/Dashboard";
import CategoryModal from "~/components/production/CategoryModal";
import MaterialModal from "~/components/production/MaterialModal";
import SupplierModal from "~/components/production/SupplierModal";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import {
	deleteCategory,
	listCategories,
} from "~/services/production/categories";
import { deleteMaterial, listMaterials } from "~/services/production/materials";
import { deleteSupplier, listSuppliers } from "~/services/production/suppliers";

const MaterialsPage = () => {
	const { addAlert, openModal } = useApp();

	// Separate pagination for each table
	const categoriesPagination = usePagination();
	const materialsPagination = usePagination();
	const suppliersPagination = usePagination();

	const [categories, { refetch: refetchCategories }] = createResource(
		() => ({
			page: categoriesPagination.page(),
			perPage: categoriesPagination.perPage(),
		}),
		listCategories,
	);
	const [materials, { refetch: refetchMaterials }] = createResource(
		() => ({
			page: materialsPagination.page(),
			perPage: materialsPagination.perPage(),
		}),
		listMaterials,
	);
	const [suppliers, { refetch: refetchSuppliers }] = createResource(
		() => ({
			page: suppliersPagination.page(),
			perPage: suppliersPagination.perPage(),
		}),
		listSuppliers,
	);

	// Update total items for each table
	createEffect(() => {
		const data = categories();
		if (data) {
			categoriesPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = materials();
		if (data) {
			materialsPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = suppliers();
		if (data) {
			suppliersPagination.setTotalItems(data.total);
		}
	});

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

	const handleSupplierDelete = async (supplierId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el proveedor "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteSupplier(supplierId);
			addAlert({ type: "success", message: "Proveedor eliminado con éxito" });
			refetchSuppliers();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar proveedor",
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
						pagination={{
							page: categoriesPagination.page(),
							totalPages: categoriesPagination.totalPages(),
							totalItems: categoriesPagination.totalItems(),
							perPage: categoriesPagination.perPage(),
							onPageChange: categoriesPagination.setPage,
							onPerPageChange: categoriesPagination.setPerPage,
						}}
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
						pagination={{
							page: materialsPagination.page(),
							totalPages: materialsPagination.totalPages(),
							totalItems: materialsPagination.totalItems(),
							perPage: materialsPagination.perPage(),
							onPageChange: materialsPagination.setPage,
							onPerPageChange: materialsPagination.setPerPage,
						}}
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
				<BlueBoard
					title="Proveedores"
					modals={[
						{
							key: Modals.Supplier,
							label: "Nuevo Proveedor",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Nombre" },
							{ label: "Telefono" },
							{ label: "Direccion" },
							{ label: "", class: "w-1/12" },
						]}
						pagination={{
							page: suppliersPagination.page(),
							totalPages: suppliersPagination.totalPages(),
							totalItems: suppliersPagination.totalItems(),
							perPage: suppliersPagination.perPage(),
							onPageChange: suppliersPagination.setPage,
							onPerPageChange: suppliersPagination.setPerPage,
						}}
					>
						<For each={suppliers()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.name}</td>
									<td>{item.phone}</td>
									<td>{item.address}</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Supplier, item.$id)}
											onDelete={() => handleSupplierDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<CategoryModal onSuccess={() => refetchCategories()} />
				<MaterialModal onSuccess={() => refetchMaterials()} />
				<SupplierModal onSuccess={() => refetchSuppliers()} />
			</DashboardLayout>
		</>
	);
};

export default MaterialsPage;
