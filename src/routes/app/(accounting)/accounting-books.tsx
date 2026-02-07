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
	deleteAccountingBook,
	listAccountingBooks,
} from "~/services/accounting/accountingBooks";

const AccountingBooksPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pageControl = usePagination();

	const [accountingBooksData, { refetch: reloadAccountingBooks }] =
		createResource(
			() => ({
				page: pageControl.page(),
				perPage: pageControl.perPage(),
			}),
			listAccountingBooks,
		);

	createEffect(() => {
		const fetchedData = accountingBooksData();
		if (fetchedData) {
			pageControl.setTotalItems(fetchedData.total);
		}
	});

	const handleEdit = (id: string): void => {
		nav(`${AppRoutes.accountingBook}/${id}`);
	};

	const handleDelete = async (id: string, name: string): Promise<void> => {
		const userConfirmed = window.confirm(
			`¿Está seguro de eliminar el libro contable "${name}"?`,
		);
		if (!userConfirmed) return;

		try {
			await deleteAccountingBook(id);
			addAlert({
				type: "success",
				message: "Libro contable eliminado con éxito",
			});
			reloadAccountingBooks();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Error al eliminar libro contable",
			});
		}
	};

	return (
		<>
			<Title>Libros Contables - Grafos</Title>
			<Breadcrumb
				links={[{ label: "Contabilidad" }, { label: "Libros Contables" }]}
			/>
			<BlueBoard
				title="Libros Contables"
				links={[
					{
						href: AppRoutes.accountingBook,
						label: "Nuevo",
					},
				]}
			>
				<Table headers={[{ label: "Nombre" }, { label: "", class: "w-1/12" }]}>
					<For each={accountingBooksData()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.name}</td>
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

export default AccountingBooksPage;
