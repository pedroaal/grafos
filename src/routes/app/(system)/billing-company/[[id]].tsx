import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { number, object, optional, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import DashboardLayout from "~/components/layouts/Dashboard";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import {
	createBillingCompany,
	getBillingCompany,
	updateBillingCompany,
} from "~/services/accounting/billingCompanies";
import { listTaxes } from "~/services/accounting/taxes";
import type { BillingCompanies } from "~/types/appwrite";

const BillingCompanySchema = object({
	email: string(),
	validFrom: string(),
	validTo: string(),
	startNumber: number(),
	taxId: string(),
	businessName: string(),
	legalRepresentative: string(),
	address: string(),
	city: string(),
	phone: string(),
	mobile: optional(string()),
	ruc: string(),
	sriKey: optional(string()),
	sriSignatureKey: optional(string()),
	cashierCode: string(),
});

type BillingCompanyForm = Omit<BillingCompanies, keyof Models.Row>;

const BillingCompanyPage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<BillingCompanyForm>({
		validate: valiForm(BillingCompanySchema),
		initialValues: {
			email: "",
			validFrom: "",
			validTo: "",
			startNumber: 1,
			taxId: "" as any,
			businessName: "",
			legalRepresentative: "",
			address: "",
			city: "",
			phone: "",
			mobile: null,
			ruc: "",
			sriKey: null,
			sriSignatureKey: null,
			cashierCode: "",
		},
	});

	const [billingCompany] = createResource(
		() => params.id ?? "",
		getBillingCompany,
	);

	const [taxesList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listTaxes,
	);

	createEffect(
		on(
			() => billingCompany(),
			(billingCompanyData) => {
				if (!billingCompanyData || !isEdit()) return;

				setValues(form, {
					email: billingCompanyData.email || "",
					validFrom: billingCompanyData.validFrom || "",
					validTo: billingCompanyData.validTo || "",
					startNumber: billingCompanyData.startNumber ?? 1,
					taxId: billingCompanyData.taxId.$id as any,
					businessName: billingCompanyData.businessName || "",
					legalRepresentative: billingCompanyData.legalRepresentative || "",
					address: billingCompanyData.address || "",
					city: billingCompanyData.city || "",
					phone: billingCompanyData.phone || "",
					mobile: billingCompanyData.mobile,
					ruc: billingCompanyData.ruc || "",
					sriKey: billingCompanyData.sriKey,
					sriSignatureKey: billingCompanyData.sriSignatureKey,
					cashierCode: billingCompanyData.cashierCode || "",
				});
			},
		),
	);

	const handleSubmit = async (formValues: BillingCompanyForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateBillingCompany(params.id!, formValues);
				addAlert({
					type: "success",
					message: "Empresa de facturación actualizada con éxito",
				});
			} else {
				await createBillingCompany(
					authStore.tenantId!,
					formValues as BillingCompanies,
				);
				addAlert({
					type: "success",
					message: "Empresa de facturación creada con éxito",
				});
			}

			nav(Routes.billingCompanies);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar empresa de facturación",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Empresa de Facturación - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Contabilidad" },
						{
							label: "Empresas de Facturación",
							route: Routes.billingCompanies,
						},
						{ label: billingCompany()?.businessName ?? "Nueva" },
					]}
				/>
				<BlueBoard
					title="Gestionar Empresa de Facturación"
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
								<Field name="businessName">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Razón Social"
											placeholder="Razón social de la empresa"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="legalRepresentative">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Representante Legal"
											placeholder="Nombre del representante legal"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="ruc">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="RUC"
											placeholder="RUC de la empresa"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="email">
									{(field, props) => (
										<Input
											{...props}
											type="email"
											label="Email"
											placeholder="correo@ejemplo.com"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="phone">
									{(field, props) => (
										<Input
											{...props}
											type="tel"
											label="Teléfono"
											placeholder="Teléfono de la empresa"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="mobile">
									{(field, props) => (
										<Input
											{...props}
											type="tel"
											label="Móvil"
											placeholder="Teléfono móvil"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="city">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Ciudad"
											placeholder="Ciudad"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="address">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Dirección"
											placeholder="Dirección de la empresa"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="validFrom">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Válido Desde"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="validTo">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Válido Hasta"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="startNumber" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Número Inicial"
											placeholder="1"
											value={field.value ?? 1}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="taxId">
									{(field, props) => (
										<Select
											{...props}
											label="Impuesto"
											options={
												taxesList()?.rows.map((tax) => ({
													value: tax.$id,
													label: `${tax.percentage}%`,
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
								<Field name="cashierCode">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Código de Caja"
											placeholder="Código de caja"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="sriKey">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Clave SRI"
											placeholder="Clave SRI (opcional)"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="sriSignatureKey">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Clave de Firma SRI"
											placeholder="Clave de firma SRI (opcional)"
											value={field.value || ""}
											error={field.error}
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

export default BillingCompanyPage;
