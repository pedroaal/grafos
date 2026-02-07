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
import { deleteContact, listContacts } from "~/services/sales/contacts";
import type { Contacts } from "~/types/appwrite";

const ContactsPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pagination = usePagination();

	const [contacts, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listContacts,
	);

	createEffect(() => {
		const data = contacts();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const handleEdit = (id: string) => {
		nav(`${AppRoutes.contact}/${id}`);
	};

	const handleDelete = async (id: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el contacto "${name}"?`,
		);
		if (!confirm) return;

		try {
			await deleteContact(id);
			addAlert({ type: "success", message: "Contacto eliminado con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar contacto",
			});
		}
	};

	return (
		<>
			<Title>Contactos - Grafos</Title>
			<Breadcrumb links={[{ label: "Ventas" }, { label: "Contactos" }]} />
			<BlueBoard
				title="Contactos"
				links={[
					{
						href: AppRoutes.contact,
						label: "Nuevo",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Nombre" },
						{ label: "Empresa" },
						{ label: "Cargo" },
						{ label: "Teléfono" },
						{ label: "Email" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={contacts()?.rows || []}>
						{(item: Contacts) => (
							<tr>
								<td>
									{item.firstName} {item.lastName}
								</td>
								<td>{item.companyId?.name ?? ""}</td>
								<td>{item.position ?? ""}</td>
								<td>{item.mobile}</td>
								<td>{item.email ?? ""}</td>
								<td>
									<RowActions
										onEdit={() => handleEdit(item.$id)}
										onDelete={() =>
											handleDelete(
												item.$id,
												`${item.firstName} ${item.lastName}`,
											)
										}
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

export default ContactsPage;
