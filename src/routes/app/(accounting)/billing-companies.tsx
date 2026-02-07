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
import {
	deleteBillingCompany,
	listBillingCompanies,
} from "~/services/accounting/billingCompanies";

const BillingCompaniesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pageControl = usePagination();

	const [billingCompaniesData, { refetch: reloadBillingCompanies }] =
		createResource(
			() => ({
				page: pageControl.page(),
				perPage: pageControl.perPage(),
			}),
			listBillingCompanies,
		);

	createEffect(() => {
		const fetchedData = billingCompaniesData();
		if (fetchedData) {
			pageControl.setTotalItems(fetchedData.total);
		}
	});

	const handleEdit = (id: string): void => {
		nav(`${AppRoutes.billingCompany}/${id}`);
	};

	const handleDelete = async (
		id: string,
		businessName: string,
	): Promise<void> => {
		const userConfirmed = window.confirm(
			`¿Está seguro de eliminar la empresa de facturación "${businessName}"?`,
		);
		if (!userConfirmed) return;

		try {
			await deleteBillingCompany(id);
			addAlert({
				type: "success",
				message: "Empresa de facturación eliminada con éxito",
			});
			reloadBillingCompanies();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Error al eliminar empresa de facturación",
			});
		}
	};

	return (
		<>
			<Title>Empresas de Facturación - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Contabilidad" },
					{ label: "Empresas de Facturación" },
				]}
			/>
			<BlueBoard
				title="Empresas de Facturación"
				links={[
					{
						href: AppRoutes.billingCompany,
						label: "Nueva Empresa de Facturación",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Razón Social" },
						{ label: "Representante Legal" },
						{ label: "Email" },
						{ label: "Teléfono" },
						{ label: "Ciudad" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={billingCompaniesData()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.businessName}</td>
								<td>{item.legalRepresentative}</td>
								<td>{item.email}</td>
								<td>{item.phone}</td>
								<td>{item.city}</td>
								<td>
									<RowActions
										onEdit={() => handleEdit(item.$id)}
										onDelete={() => handleDelete(item.$id, item.businessName)}
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
		</>
	);
};

export default BillingCompaniesPage;
