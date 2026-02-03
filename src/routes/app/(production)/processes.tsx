import { Title } from "@solidjs/meta";
import { createResource, For, createEffect } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";
import DashboardLayout from "~/components/layouts/Dashboard";
import AreaModal from "~/components/production/AreaModal";
import InkModal from "~/components/production/InkModal";
import ProcessModal from "~/components/production/ProcessModal";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteArea, listAreas } from "~/services/production/areas";
import { deleteInk, listInks } from "~/services/production/inks";
import { deleteProcess, listProcesses } from "~/services/production/processes";

const ProcessesPage = () => {
	const { addAlert, openModal } = useApp();

	// Separate pagination for each table
	const areasPagination = usePagination();
	const processesPagination = usePagination();
	const inksPagination = usePagination();

	const [areas, { refetch: refetchAreas }] = createResource(
		() => ({
			page: areasPagination.page(),
			perPage: areasPagination.perPage(),
		}),
		listAreas,
	);
	const [processes, { refetch: refetchProcesses }] = createResource(
		() => ({
			page: processesPagination.page(),
			perPage: processesPagination.perPage(),
		}),
		listProcesses,
	);
	const [inks, { refetch: refetchInks }] = createResource(
		() => ({
			page: inksPagination.page(),
			perPage: inksPagination.perPage(),
		}),
		listInks,
	);

	// Update total items for each table
	createEffect(() => {
		const data = areas();
		if (data) {
			areasPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = processes();
		if (data) {
			processesPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = inks();
		if (data) {
			inksPagination.setTotalItems(data.total);
		}
	});

	const editRow = (modalId: string, id: string) => {
		openModal(modalId, { id });
	};

	const handleAreaDelete = async (areaId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el área "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteArea(areaId);
			addAlert({ type: "success", message: "Área eliminada con éxito" });
			refetchAreas();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar área",
			});
		}
	};

	const handleProcessDelete = async (processId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el proceso "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteProcess(processId);
			addAlert({ type: "success", message: "Proceso eliminado con éxito" });
			refetchProcesses();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar proceso",
			});
		}
	};

	const handleInkDelete = async (inkId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la tinta "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteInk(inkId);
			addAlert({ type: "success", message: "Tinta eliminada con éxito" });
			refetchInks();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar tinta",
			});
		}
	};

	return (
		<>
			<Title>Procesos - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb links={[{ label: "Produccion" }, { label: "Procesos" }]} />
				<BlueBoard
					title="Areas"
					modals={[
						{
							key: Modals.Area,
							label: "Nueva Area",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Nombre" },
							{ label: "Orden" },
							{ label: "", class: "w-1/12" },
						]}
						pagination={{
							page: areasPagination.page(),
							totalPages: areasPagination.totalPages(),
							totalItems: areasPagination.totalItems(),
							perPage: areasPagination.perPage(),
							onPageChange: areasPagination.setPage,
							onPerPageChange: areasPagination.setPerPage,
						}}
					>
						<For each={areas()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.name}</td>
									<td>{item.sortOrder}</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Area, item.$id)}
											onDelete={() => handleAreaDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<BlueBoard
					title="Procesos"
					modals={[
						{
							key: Modals.Process,
							label: "Nuevo Proceso",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Nombre" },
							{ label: "Area" },
							{ label: "Objetivo" },
							{ label: "Interno" },
							{ label: "Seguimiento" },
							{ label: "", class: "w-1/12" },
						]}
						pagination={{
							page: processesPagination.page(),
							totalPages: processesPagination.totalPages(),
							totalItems: processesPagination.totalItems(),
							perPage: processesPagination.perPage(),
							onPageChange: processesPagination.setPage,
							onPerPageChange: processesPagination.setPerPage,
						}}
					>
						<For each={processes()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.name}</td>
									<td>{item.areaId?.name || ""}</td>
									<td>{item.goal}</td>
									<td>
										<TrueFalse value={item.internal} />
									</td>
									<td>
										<TrueFalse value={item.followUp} />
									</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Process, item.$id)}
											onDelete={() => handleProcessDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<BlueBoard
					title="Tintas"
					modals={[
						{
							key: Modals.Ink,
							label: "Nueva Tinta",
						},
					]}
				>
					<Table
						headers={[{ label: "Color" }, { label: "", class: "w-1/12" }]}
						pagination={{
							page: inksPagination.page(),
							totalPages: inksPagination.totalPages(),
							totalItems: inksPagination.totalItems(),
							perPage: inksPagination.perPage(),
							onPageChange: inksPagination.setPage,
							onPerPageChange: inksPagination.setPerPage,
						}}
					>
						<For each={inks()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.color}</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Ink, item.$id)}
											onDelete={() => handleInkDelete(item.$id, item.color)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<AreaModal onSuccess={() => refetchAreas()} />
				<ProcessModal onSuccess={() => refetchProcesses()} />
				<InkModal onSuccess={() => refetchInks()} />
			</DashboardLayout>
		</>
	);
};

export default ProcessesPage;
