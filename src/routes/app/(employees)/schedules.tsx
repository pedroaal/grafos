import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";

import { AppRoutes } from "~/config/routes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteSchedule, listSchedules } from "~/services/employees/schedules";

const SchedulesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();

	const pagination = usePagination();

	const [schedules, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listSchedules,
	);

	createEffect(() => {
		const data = schedules();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const handleEdit = (id: string) => {
		nav(`${AppRoutes.schedule}/${id}`);
	};

	const handleDelete = async (id: string) => {
		const confirm = window.confirm("¿Está seguro de eliminar este horario?");
		if (!confirm) return;

		try {
			await deleteSchedule(id);
			addAlert({ type: "success", message: "Horario eliminado con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar horario",
			});
		}
	};

	return (
		<>
			<Title>Horarios - Grafos</Title>
			<Breadcrumb links={[{ label: "Empleados" }, { label: "Horarios" }]} />
			<BlueBoard
				title="Horarios"
				links={[
					{
						href: AppRoutes.schedule,
						label: "Nuevo",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Nombre" },
						{ label: "Entrada Mañana" },
						{ label: "Salida Mañana" },
						{ label: "Entrada Tarde" },
						{ label: "Salida Tarde" },
						{ label: "Espera (min)" },
						{ label: "Gracia (min)" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={schedules()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.name}</td>
								<td>{item.morningArrival}</td>
								<td>{item.morningDeparture}</td>
								<td>{item.afternoonArrival}</td>
								<td>{item.afternoonDeparture}</td>
								<td>{item.waitMinutes}</td>
								<td>{item.graceMinutes}</td>
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
		</>
	);
};

export default SchedulesPage;
