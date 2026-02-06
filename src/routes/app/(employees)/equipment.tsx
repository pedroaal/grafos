import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import DashboardLayout from "~/components/layouts/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteEquipment, listEquipment } from "~/services/employees/equipment";

const EquipmentPage = () => {
	const navigate = useNavigate();
	const { addAlert } = useApp();

	const pagination = usePagination();

	const [equipment, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listEquipment,
	);

	createEffect(() => {
		const data = equipment();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const handleEdit = (id: string) => {
		navigate(`${Routes.equipmentItem}/${id}`);
	};

	const handleDelete = async (id: string) => {
		const confirm = window.confirm(
			"¿Está seguro de eliminar este equipo?",
		);
		if (!confirm) return;

		try {
			await deleteEquipment(id);
			addAlert({ type: "success", message: "Equipo eliminado con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar equipo",
			});
		}
	};

	return (
		<>
			<Title>Equipos - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb links={[{ label: "Empleados" }, { label: "Equipos" }]} />
				<BlueBoard
					title="Gestionar Equipos"
					links={[
						{
							href: Routes.equipmentItem,
							label: "Nuevo Equipo",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Nombre" },
							{ label: "Estado" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={equipment()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.name}</td>
									<td>
										<span
											class={
												item.active ? "badge badge-success" : "badge badge-error"
											}
										>
											{item.active ? "Activo" : "Inactivo"}
										</span>
									</td>
									<td>
										<RowActions
											onEdit={() => handleEdit(item.$id)}
											onDelete={() => handleDelete(item.$id)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
					<Pagination
						page={pagination.page()}
						totalPages={pagination.totalPages()}
						totalItems={pagination.totalItems()}
						perPage={pagination.perPage()}
						onPageChange={pagination.setPage}
						onPerPageChange={pagination.setPerPage}
					/>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default EquipmentPage;
