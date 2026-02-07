import { Title } from "@solidjs/meta";
import { createEffect, createResource, For } from "solid-js";
import { BankAccountModal } from "~/components/accounting/BankAccountModal";
import { BookReferenceModal } from "~/components/accounting/BookReferenceModal";
import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import {
	deleteBankAccount,
	listBankAccounts,
} from "~/services/accounting/bankAccounts";
import {
	deleteBookReference,
	listBookReferences,
} from "~/services/accounting/bookReferences";

const BanksPage = () => {
	const { addAlert, openModal } = useApp();

	const bankAccountsPagination = usePagination();
	const bookReferencesPagination = usePagination();

	const [bankAccounts, { refetch: refetchBankAccounts }] = createResource(
		() => ({
			page: bankAccountsPagination.page(),
			perPage: bankAccountsPagination.perPage(),
		}),
		listBankAccounts,
	);
	const [bookReferences, { refetch: refetchBookReferences }] = createResource(
		() => ({
			page: bookReferencesPagination.page(),
			perPage: bookReferencesPagination.perPage(),
		}),
		listBookReferences,
	);

	createEffect(() => {
		const data = bankAccounts();
		if (data) {
			bankAccountsPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = bookReferences();
		if (data) {
			bookReferencesPagination.setTotalItems(data.total);
		}
	});

	const editRow = (modalId: string, id: string) => {
		openModal(modalId, { id });
	};

	const handleBankAccountDelete = async (
		bankAccountId: string,
		name: string,
	) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la cuenta bancaria "${name}"?`,
		);
		if (!confirm) return;

		try {
			await deleteBankAccount(bankAccountId);
			addAlert({
				type: "success",
				message: "Cuenta bancaria eliminada con éxito",
			});
			refetchBankAccounts();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar cuenta bancaria",
			});
		}
	};

	const handleBookReferenceDelete = async (
		bookReferenceId: string,
		reference: string,
	) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la referencia de libro "${reference}"?`,
		);
		if (!confirm) return;

		try {
			await deleteBookReference(bookReferenceId);
			addAlert({
				type: "success",
				message: "Referencia de libro eliminada con éxito",
			});
			refetchBookReferences();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar referencia de libro",
			});
		}
	};

	return (
		<>
			<Title>Bancos - Grafos</Title>
			<Breadcrumb links={[{ label: "Contabilidad" }, { label: "Bancos" }]} />
			<BlueBoard
				title="Cuentas Bancarias"
				modals={[
					{
						key: Modals.BankAccount,
						label: "Nueva Cuenta Bancaria",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Banco" },
						{ label: "Número de Cuenta" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={bankAccounts()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.name}</td>
								<td>{item.accountNumber}</td>
								<td>
									<RowActions
										onEdit={() => editRow(Modals.BankAccount, item.$id)}
										onDelete={() =>
											handleBankAccountDelete(item.$id, item.name)
										}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={bankAccountsPagination.page()}
					totalPages={bankAccountsPagination.totalPages()}
					totalItems={bankAccountsPagination.totalItems()}
					perPage={bankAccountsPagination.perPage()}
					onPageChange={bankAccountsPagination.setPage}
					onPerPageChange={bankAccountsPagination.setPerPage}
				/>
			</BlueBoard>
			<BlueBoard
				title="Referencias de Libros"
				modals={[
					{
						key: Modals.BookReference,
						label: "Nueva Referencia de Libro",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Referencia" },
						{ label: "Descripción" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={bookReferences()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.reference}</td>
								<td>{item.description}</td>
								<td>
									<RowActions
										onEdit={() => editRow(Modals.BookReference, item.$id)}
										onDelete={() =>
											handleBookReferenceDelete(item.$id, item.reference)
										}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={bookReferencesPagination.page()}
					totalPages={bookReferencesPagination.totalPages()}
					totalItems={bookReferencesPagination.totalItems()}
					perPage={bookReferencesPagination.perPage()}
					onPageChange={bookReferencesPagination.setPage}
					onPerPageChange={bookReferencesPagination.setPerPage}
				/>
			</BlueBoard>
			<BankAccountModal onSuccess={() => refetchBankAccounts()} />
			<BookReferenceModal onSuccess={() => refetchBookReferences()} />
		</>
	);
};

export default BanksPage;
