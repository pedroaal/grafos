import { Title } from "@solidjs/meta";
import { createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";
import DashboardLayout from "~/components/layout/Dashboard";
import AreaModal from "~/components/production/AreaModal";
import ProcessModal from "~/components/production/ProcessModal";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { listAreas } from "~/services/production/areas";
import { deleteOrder } from "~/services/production/orders";
import { listProcesses } from "~/services/production/processes";

const ProcessesPage = () => {
	const { addAlert, openModal } = useApp();

	const [areas, { refetchAreas }] = createResource({}, listAreas);
	const [processes, { refetchProcesses }] = createResource({}, listProcesses);

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
					>
						<For each={areas()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.name}</td>
									<td>{item.sortOrder}</td>
									<td>
										<RowActions
											onEdit={() => editRow(Modals.Area, item.$id)}
											onDelete={() => handleDelete(item.$id, item.name)}
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
											onDelete={() => handleDelete(item.$id, item.name)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<AreaModal />
				<ProcessModal />
			</DashboardLayout>
		</>
	);
};

export default ProcessesPage;
