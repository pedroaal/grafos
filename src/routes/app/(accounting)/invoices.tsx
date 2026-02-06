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
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteInvoice, listInvoices } from "~/services/accounting/invoices";

const INVOICE_STATUS_LABELS: Record<string, string> = {
	pending: "Pendiente",
	paid: "Pagado",
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
	cash: "Efectivo",
	transfer: "Transferencia",
	exchange: "Permuta",
	card: "Tarjeta",
};

const InvoicesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pageControl = usePagination();

	const [invoicesData, { refetch: reloadInvoices }] = createResource(
		() => ({
			page: pageControl.page(),
			perPage: pageControl.perPage(),
		}),
		listInvoices,
	);

	createEffect(() => {
		const fetchedData = invoicesData();
		if (fetchedData) {
			pageControl.setTotalItems(fetchedData.total);
		}
	});

	const handleEdit = (id: string): void => {
		nav(`${Routes.invoice}/${id}`);
	};

	const handleDelete = async (
		id: string,
		invoiceNumber: number,
	): Promise<void> => {
		const userConfirmed = window.confirm(
			`¿Está seguro de eliminar la factura #${invoiceNumber}?`,
		);
		if (!userConfirmed) return;

		try {
			await deleteInvoice(id);
			addAlert({
				type: "success",
				message: "Factura eliminada con éxito",
			});
			reloadInvoices();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Error al eliminar factura",
			});
		}
	};

	return (
		<>
			<Title>Facturas - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[{ label: "Contabilidad" }, { label: "Facturas" }]}
				/>
				<BlueBoard
					title="Facturas"
					links={[
						{
							href: Routes.invoice,
							label: "Nueva Factura",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Número" },
							{ label: "Cliente" },
							{ label: "Empresa" },
							{ label: "Fecha Emisión" },
							{ label: "Fecha Vencimiento" },
							{ label: "Estado" },
							{ label: "Tipo Pago" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={invoicesData()?.rows || []}>
							{(item) => (
								<tr>
									<td>#{item.invoiceNumber}</td>
									<td>
										{item.clientId?.contactId
											? `${item.clientId.contactId.firstName} ${item.clientId.contactId.lastName}`
											: ""}
									</td>
									<td>{item.billingCompanyId?.businessName || ""}</td>
									<td>{item.issueDate}</td>
									<td>{item.dueDate}</td>
									<td>
										<span
											class={
												item.status === "paid"
													? "badge badge-success"
													: "badge badge-warning"
											}
										>
											{INVOICE_STATUS_LABELS[item.status] || item.status}
										</span>
									</td>
									<td>
										{PAYMENT_TYPE_LABELS[item.paymentType] || item.paymentType}
									</td>
									<td>
										<RowActions
											onEdit={() => handleEdit(item.$id)}
											onDelete={() =>
												handleDelete(item.$id, item.invoiceNumber)
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

export default InvoicesPage;
