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
import { TAXPAYER_TYPE_LABELS } from "~/config/taxes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteClient, listClients } from "~/services/sales/clients";
import type { Clients } from "~/types/appwrite";

const ClientsListPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pageControl = usePagination();

	const [clientsData, { refetch: reloadClients }] = createResource(
		() => ({
			page: pageControl.page(),
			perPage: pageControl.perPage(),
		}),
		listClients,
	);

	createEffect(() => {
		const fetchedData = clientsData();
		if (fetchedData) {
			pageControl.setTotalItems(fetchedData.total);
		}
	});

	const navigateToEdit = (clientId: string): void => {
		nav(`${Routes.client}/${clientId}`);
	};

	const removeClientRecord = async (
		clientId: string,
		contactName: string,
	): Promise<void> => {
		const userConfirmed = window.confirm(
			`¿Confirma eliminar al cliente "${contactName}"?`,
		);
		if (!userConfirmed) return;

		try {
			await deleteClient(clientId);
			addAlert({ type: "success", message: "Cliente eliminado exitosamente" });
			reloadClients();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "No se pudo eliminar el cliente",
			});
		}
	};

	const getContactFullName = (client: Clients): string => {
		const contact = client.contactId;
		return `${contact.firstName} ${contact.lastName}`;
	};

	const getTaxpayerLabel = (type: string): string => {
		return TAXPAYER_TYPE_LABELS[type] || type;
	};

	return (
		<>
			<Title>Clientes - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb links={[{ label: "Ventas" }, { label: "Clientes" }]} />
				<BlueBoard
					title="Administrar Clientes"
					links={[
						{
							href: Routes.client,
							label: "Agregar Cliente",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Contacto" },
							{ label: "Empresa" },
							{ label: "Tipo Contribuyente" },
							{ label: "Seguimiento" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={clientsData()?.rows || []}>
							{(clientRecord: Clients) => (
								<tr>
									<td>{getContactFullName(clientRecord)}</td>
									<td>{clientRecord.companyId.name}</td>
									<td>{getTaxpayerLabel(clientRecord.taxpayerType)}</td>
									<td>
										<span
											class={
												clientRecord.followUp
													? "badge badge-success"
													: "badge badge-ghost"
											}
										>
											{clientRecord.followUp ? "Activo" : "Inactivo"}
										</span>
									</td>
									<td>
										<RowActions
											onEdit={() => navigateToEdit(clientRecord.$id)}
											onDelete={() =>
												removeClientRecord(
													clientRecord.$id,
													getContactFullName(clientRecord),
												)
											}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
					<Pagination
						page={pageControl.page()}
						totalPages={pageControl.totalPages()}
						totalItems={pageControl.totalItems()}
						perPage={pageControl.perPage()}
						onPageChange={pageControl.setPage}
						onPerPageChange={pageControl.setPerPage}
					/>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default ClientsListPage;
