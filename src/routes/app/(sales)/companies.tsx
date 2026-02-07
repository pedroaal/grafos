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
import { deleteCompany, listCompanies } from "~/services/sales/companies";
import type { Companies } from "~/types/appwrite";

const CompaniesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pagination = usePagination();

	const [companies, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listCompanies,
	);

	createEffect(() => {
		const data = companies();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const handleEdit = (id: string) => {
		nav(`${AppRoutes.company}/${id}`);
	};

	const handleDelete = async (id: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la empresa "${name}"?`,
		);
		if (!confirm) return;

		try {
			await deleteCompany(id);
			addAlert({ type: "success", message: "Empresa eliminada con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar empresa",
			});
		}
	};

	return (
		<>
			<Title>Empresas - Grafos</Title>
			<Breadcrumb links={[{ label: "Ventas" }, { label: "Empresas" }]} />
			<BlueBoard
				title="Empresas"
				links={[
					{
						href: AppRoutes.company,
						label: "Nueva",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Nombre" },
						{ label: "RUC" },
						{ label: "Actividad" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={companies()?.rows || []}>
						{(item: Companies) => (
							<tr>
								<td>{item.name}</td>
								<td>{item.ruc}</td>
								<td>{item.activity}</td>
								<td>
									<RowActions
										onEdit={() => handleEdit(item.$id)}
										onDelete={() => handleDelete(item.$id, item.name)}
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

export default CompaniesPage;
