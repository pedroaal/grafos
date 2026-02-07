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
import { deleteTask, listTask } from "~/services/sales/tasks";
import type { Task } from "~/types/appwrite";

const TasksPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const paginationState = usePagination();

	const [crmRecords, { refetch: refreshTask }] = createResource(
		() => ({
			page: paginationState.page(),
			perPage: paginationState.perPage(),
		}),
		listTask,
	);

	createEffect(() => {
		const dataLoaded = crmRecords();
		if (dataLoaded) {
			paginationState.setTotalItems(dataLoaded.total);
		}
	});

	const openEditForm = (recordId: string): void => {
		nav(`${AppRoutes.task}/${recordId}`);
	};

	const deleteRecord = async (recordId: string): Promise<void> => {
		const confirmDelete = window.confirm(
			"¿Desea eliminar este registro de CRM?",
		);
		if (!confirmDelete) return;

		try {
			await deleteTask(recordId);
			addAlert({ type: "success", message: "Registro CRM eliminado" });
			refreshTask();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Error al eliminar registro",
			});
		}
	};

	const formatScheduledDate = (dateStr: string): string => {
		const dt = new Date(dateStr);
		return dt.toLocaleDateString("es-ES", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getAssignedUserName = (record: Task): string => {
		const user = record.assignedId;
		return `${user.firstName} ${user.lastName}`;
	};

	const getContactName = (record: Task): string => {
		const contact = record.contactId;
		return `${contact.firstName} ${contact.lastName}`;
	};

	return (
		<>
			<Title>Tareas - Grafos</Title>
			<Breadcrumb links={[{ label: "Ventas" }, { label: "Tareas" }]} />
			<BlueBoard
				title="Tareas"
				links={[
					{
						href: AppRoutes.task,
						label: "Nueva",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Fecha Programada" },
						{ label: "Actividad" },
						{ label: "Asignado a" },
						{ label: "Contacto" },
						{ label: "Estado" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={crmRecords()?.rows || []}>
						{(entry: Task) => (
							<tr>
								<td>{formatScheduledDate(entry.scheduled)}</td>
								<td>{entry.activityId.name}</td>
								<td>{getAssignedUserName(entry)}</td>
								<td>{getContactName(entry)}</td>
								<td>
									<span
										class={
											entry.active ? "badge badge-primary" : "badge badge-ghost"
										}
									>
										{entry.active ? "Activo" : "Inactivo"}
									</span>
								</td>
								<td>
									<RowActions
										onEdit={() => openEditForm(entry.$id)}
										onDelete={() => deleteRecord(entry.$id)}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={paginationState.page()}
					totalPages={paginationState.totalPages()}
					totalItems={paginationState.totalItems()}
					perPage={paginationState.perPage()}
					onPageChange={paginationState.setPage}
					onPerPageChange={paginationState.setPerPage}
				/>
			</BlueBoard>
		</>
	);
};

export default TasksPage;
