import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layouts/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import type { AccountingBooks } from "~/types/appwrite";
import {
	createAccountingBook,
	getAccountingBook,
	updateAccountingBook,
} from "~/services/accounting/accountingBooks";

const AccountingBookSchema = object({
	name: string(),
});

type AccountingBookForm = Omit<AccountingBooks, keyof Models.Row>;

const AccountingBookPage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<AccountingBookForm>({
		validate: valiForm(AccountingBookSchema),
		initialValues: {
			name: "",
		},
	});

	const [accountingBook] = createResource(
		() => params.id ?? "",
		getAccountingBook,
	);

	createEffect(
		on(
			() => accountingBook(),
			(accountingBookData) => {
				if (!accountingBookData || !isEdit()) return;

				setValues(form, {
					name: accountingBookData.name || "",
				});
			},
		),
	);

	const handleSubmit = async (formValues: AccountingBookForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateAccountingBook(params.id!, formValues);
				addAlert({
					type: "success",
					message: "Libro contable actualizado con éxito",
				});
			} else {
				await createAccountingBook(
					authStore.tenantId!,
					formValues as AccountingBooks,
				);
				addAlert({
					type: "success",
					message: "Libro contable creado con éxito",
				});
			}

			nav(Routes.accountingBooks);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar libro contable",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Libro Contable - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Contabilidad" },
						{ label: "Libros Contables", route: Routes.accountingBooks },
						{ label: accountingBook()?.name ?? "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Libro Contable"
					actions={[
						{
							label: "Guardar",
							onClick: () => submit(form),
						},
					]}
				>
					<Form onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 gap-4">
							<Field name="name">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Nombre"
										placeholder="Nombre del libro contable"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>
					</Form>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default AccountingBookPage;
