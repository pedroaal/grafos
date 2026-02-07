import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { createAsync, useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, number, object, optional, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useUser } from "~/hooks/useUser";

import { listAccountingBooks } from "~/services/accounting/accountingBooks";
import { listBankAccounts } from "~/services/accounting/bankAccounts";
import { listBookReferences } from "~/services/accounting/bookReferences";
import {
	createBookTransaction,
	getBookTransaction,
	updateBookTransaction,
} from "~/services/accounting/bookTransactions";
import type { BookTransactions } from "~/types/appwrite";

const BookTransactionSchema = object({
	bookId: string(),
	bookReferenceId: string(),
	beneficiary: string(),
	idNumber: optional(string()),
	detail: string(),
	income: optional(number()),
	expense: optional(number()),
	bankId: string(),
	accountNumber: optional(string()),
	checkNumber: optional(string()),
	date: string(),
	type: boolean(),
});

type BookTransactionForm = Omit<BookTransactions, keyof Models.Row | "userId">;

const BookTransactionPage = () => {
	const params = useParams();
	const nav = useNavigate();
	const auth = useUser();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<BookTransactionForm>({
		validate: valiForm(BookTransactionSchema),
		initialValues: {
			bookId: "" as any,
			bookReferenceId: "" as any,
			beneficiary: "",
			idNumber: null,
			detail: "",
			income: null,
			expense: null,
			bankId: "" as any,
			accountNumber: null,
			checkNumber: null,
			date: new Date().toISOString().split("T")[0],
			type: true,
		},
	});

	const [bookTransaction] = createResource(
		() => params.id ?? "",
		getBookTransaction,
	);

	const [accountingBooksList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listAccountingBooks,
	);

	const [bookReferencesList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listBookReferences,
	);

	const [bankAccountsList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listBankAccounts,
	);

	createEffect(
		on(
			() => bookTransaction(),
			(bookTransactionData) => {
				if (!bookTransactionData || !isEdit()) return;

				setValues(form, {
					bookId: bookTransactionData.bookId.$id as any,
					bookReferenceId: bookTransactionData.bookReferenceId.$id as any,
					beneficiary: bookTransactionData.beneficiary || "",
					idNumber: bookTransactionData.idNumber,
					detail: bookTransactionData.detail || "",
					income: bookTransactionData.income,
					expense: bookTransactionData.expense,
					bankId: bookTransactionData.bankId.$id as any,
					accountNumber: bookTransactionData.accountNumber,
					checkNumber: bookTransactionData.checkNumber,
					date: bookTransactionData.date || "",
					type: bookTransactionData.type ?? true,
				});
			},
		),
	);

	const handleSubmit = async (formValues: BookTransactionForm) => {
		const loaderId = addLoader();
		try {
			const payload = {
				...formValues,
				userId: auth()?.user!.$id,
			} as BookTransactions;

			if (isEdit()) {
				await updateBookTransaction(params.id!, payload);
				addAlert({
					type: "success",
					message: "Transacción actualizada con éxito",
				});
			} else {
				await createBookTransaction(auth()?.tenantId!, payload);
				addAlert({
					type: "success",
					message: "Transacción creada con éxito",
				});
			}

			nav(Routes.bookTransactions);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar transacción",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Transacción de Libro - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Contabilidad" },
					{ label: "Transacciones de Libro", route: Routes.bookTransactions },
					{ label: bookTransaction()?.detail ?? "Nueva" },
				]}
			/>
			<BlueBoard
				title="Gestionar Transacción de Libro"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(form),
					},
				]}
			>
				<Form onSubmit={handleSubmit}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div class="md:col-span-4">
							<Field name="bookId">
								{(field, props) => (
									<Select
										{...props}
										label="Libro Contable"
										options={
											accountingBooksList()?.rows.map((book) => ({
												key: book.$id,
												label: book.name,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="bookReferenceId">
								{(field, props) => (
									<Select
										{...props}
										label="Referencia de Libro"
										options={
											bookReferencesList()?.rows.map((ref) => ({
												key: ref.$id,
												label: `${ref.reference} - ${ref.description}`,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="date">
								{(field, props) => (
									<Input
										{...props}
										type="date"
										label="Fecha"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="beneficiary">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Beneficiario"
										placeholder="Nombre del beneficiario"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="idNumber">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Número de Identificación"
										placeholder="Cédula/RUC (opcional)"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-12">
							<Field name="detail">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Detalle"
										placeholder="Descripción de la transacción"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="income" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Ingreso"
										placeholder="0.00"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="expense" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Egreso"
										placeholder="0.00"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="bankId">
								{(field, props) => (
									<Select
										{...props}
										label="Banco"
										options={
											bankAccountsList()?.rows.map((bank) => ({
												key: bank.$id,
												label: bank.name,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="accountNumber">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Número de Cuenta"
										placeholder="Número de cuenta (opcional)"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="checkNumber">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Número de Cheque"
										placeholder="Número de cheque (opcional)"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-12">
							<Field name="type" type="boolean">
								{(field, props) => (
									<Select
										{...props}
										label="Tipo"
										options={[
											{ key: "true", label: "Ingreso" },
											{ key: "false", label: "Egreso" },
										]}
										value={field.value ? "true" : "false"}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>
					</div>
				</Form>
			</BlueBoard>
		</>
	);
};

export default BookTransactionPage;
