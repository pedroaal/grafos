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
import {
	createCompany,
	getCompany,
	updateCompany,
} from "~/services/sales/companies";
import type { Companies } from "~/types/appwrite";

const CompanySchema = object({
	name: string(),
	ruc: string(),
	activity: string(),
});

type CompanyForm = Omit<Companies, keyof Models.Row>;

const CompanyPage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<CompanyForm>({
		validate: valiForm(CompanySchema),
		initialValues: {
			name: "",
			ruc: "",
			activity: "",
		},
	});

	const [company] = createResource(() => params.id ?? "", getCompany);

	createEffect(
		on(
			() => company(),
			(companyData) => {
				if (!companyData || !isEdit()) return;

				setValues(form, {
					name: companyData.name || "",
					ruc: companyData.ruc || "",
					activity: companyData.activity || "",
				});
			},
		),
	);

	const handleSubmit = async (formValues: CompanyForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateCompany(params.id!, formValues);
				addAlert({ type: "success", message: "Empresa actualizada con éxito" });
			} else {
				await createCompany(formValues as Companies);
				addAlert({ type: "success", message: "Empresa creada con éxito" });
			}

			nav(Routes.companies);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar empresa",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Empresa - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Ventas" },
						{ label: "Empresas", route: Routes.companies },
						{ label: company()?.name ?? "Nueva" },
					]}
				/>
				<BlueBoard
					title="Gestionar Empresa"
					actions={[
						{
							label: "Guardar",
							onClick: () => submit(form),
						},
					]}
				>
					<Form onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-6">
								<Field name="name">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nombre"
											placeholder="Nombre de la empresa"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="ruc">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="RUC"
											placeholder="RUC"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="activity">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Actividad"
											placeholder="Actividad"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
						</div>
					</Form>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default CompanyPage;
