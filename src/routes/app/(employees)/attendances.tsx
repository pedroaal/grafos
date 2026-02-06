import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, For } from "solid-js";
import dayjs from "dayjs";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import DashboardLayout from "~/components/layouts/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteAttendance, listAttendance } from "~/services/employees/attendance";

const AttendancesPage = () => {
	const navigate = useNavigate();
	const { addAlert } = useApp();

	const pagination = usePagination();

	const [attendances, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listAttendance,
	);

	createEffect(() => {
		const data = attendances();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const handleEdit = (id: string) => {
		navigate(`${Routes.attendance}/${id}`);
	};

	const handleDelete = async (id: string) => {
		const confirm = window.confirm(
			"¿Está seguro de eliminar este registro de asistencia?",
		);
		if (!confirm) return;

		try {
			await deleteAttendance(id);
			addAlert({ type: "success", message: "Asistencia eliminada con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar asistencia",
			});
		}
	};

	return (
		<>
			<Title>Asistencias - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[{ label: "Empleados" }, { label: "Asistencias" }]}
				/>
				<BlueBoard
					title="Gestionar Asistencias"
					links={[
						{
							href: Routes.attendance,
							label: "Nueva Asistencia",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Usuario" },
							{ label: "Fecha" },
							{ label: "Entrada Mañana" },
							{ label: "Salida Mañana" },
							{ label: "Entrada Tarde" },
							{ label: "Salida Tarde" },
							{ label: "Horas Totales" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={attendances()?.rows || []}>
							{(item) => (
								<tr>
									<td>
										{item.userId?.firstName} {item.userId?.lastName}
									</td>
									<td>{dayjs(item.date).format("DD/MM/YYYY")}</td>
									<td>{item.morningArrival}</td>
									<td>{item.morningDeparture || "-"}</td>
									<td>{item.afternoonArrival || "-"}</td>
									<td>{item.afternoonDeparture || "-"}</td>
									<td>{item.totalHours || "-"}</td>
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

export default AttendancesPage;
