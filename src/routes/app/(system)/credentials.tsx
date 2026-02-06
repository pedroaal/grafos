import { Title } from "@solidjs/meta";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import DashboardLayout from "~/components/layouts/Dashboard";
import CredentialModal from "~/components/system/CredentialModal";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import {
	deleteCredential,
	listCredentials,
} from "~/services/system/credentials";

const CredentialsPage = () => {
	const { addAlert, openModal } = useApp();

	const pagination = usePagination();

	const [credentials, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listCredentials,
	);

	createEffect(() => {
		const data = credentials();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const editRow = (id: string) => {
		openModal(Modals.Credential, { id });
	};

	const handleDelete = async (id: string, account: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la credencial "${account}"?`,
		);
		if (!confirm) return;

		try {
			await deleteCredential(id);
			addAlert({
				type: "success",
				message: "Credencial eliminada con éxito",
			});
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar credencial",
			});
		}
	};

	const maskPassword = (password: string): string => {
		if (!password) return "";
		return "•".repeat(Math.min(password.length, 12));
	};

	return (
		<>
			<Title>Credenciales - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb links={[{ label: "Sistema" }, { label: "Credenciales" }]} />
				<BlueBoard
					title="Credenciales"
					modals={[
						{
							key: Modals.Credential,
							label: "Nueva Credencial",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Cuenta" },
							{ label: "Usuario" },
							{ label: "Contraseña" },
							{ label: "Pista" },
							{ label: "URL" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={credentials()?.rows || []}>
							{(item) => (
								<tr>
									<td>{item.account}</td>
									<td>{item.username}</td>
									<td>{maskPassword(item.password)}</td>
									<td>{item.hint || "-"}</td>
									<td>
										{item.url ? (
											<a
												href={item.url}
												target="_blank"
												rel="noopener noreferrer"
												class="link link-primary"
											>
												{item.url}
											</a>
										) : (
											"-"
										)}
									</td>
									<td>
										<RowActions
											onEdit={() => editRow(item.$id)}
											onDelete={() => handleDelete(item.$id, item.account)}
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
				<CredentialModal onSuccess={() => refetch()} />
			</DashboardLayout>
		</>
	);
};

export default CredentialsPage;
