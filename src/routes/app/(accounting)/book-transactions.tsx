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
	deleteBookTransaction,
	listBookTransactions,
} from "~/services/accounting/bookTransactions";

const BookTransactionsPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pageControl = usePagination();

	const [bookTransactionsData, { refetch: reloadBookTransactions }] =
		createResource(
			() => ({
				page: pageControl.page(),
				perPage: pageControl.perPage(),
			}),
			listBookTransactions,
		);

	createEffect(() => {
		const fetchedData = bookTransactionsData();
		if (fetchedData) {
			pageControl.setTotalItems(fetchedData.total);
		}
	});

	const handleEdit = (id: string): void => {
		nav(`${AppRoutes.bookTransaction}/${id}`);
	};

	const handleDelete = async (id: string, detail: string): Promise<void> => {
		const userConfirmed = window.confirm(
			`¿Está seguro de eliminar la transacción "${detail}"?`,
		);
		if (!userConfirmed) return;

		try {
			await deleteBookTransaction(id);
			addAlert({
				type: "success",
				message: "Transacción eliminada con éxito",
			});
			reloadBookTransactions();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Error al eliminar transacción",
			});
		}
	};

	return (
		<>
			<Title>Transacciones Contables - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Contabilidad" },
					{ label: "Transacciones Contables" },
				]}
			/>
			<BlueBoard
				title="Transacciones Contables"
				links={[
					{
						href: AppRoutes.bookTransaction,
						label: "Nueva",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Libro" },
						{ label: "Beneficiario" },
						{ label: "Detalle" },
						{ label: "Ingreso" },
						{ label: "Egreso" },
						{ label: "Banco" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={bookTransactionsData()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.bookId?.name || ""}</td>
								<td>{item.beneficiary}</td>
								<td>{item.detail}</td>
								<td>{item.income ? `$${item.income.toFixed(2)}` : "-"}</td>
								<td>{item.expense ? `$${item.expense.toFixed(2)}` : "-"}</td>
								<td>{item.bankId?.name || ""}</td>
								<td>
									<RowActions
										onEdit={() => handleEdit(item.$id)}
										onDelete={() => handleDelete(item.$id, item.detail)}
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

export default BookTransactionsPage;
