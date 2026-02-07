import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { nullable, number, object, optional, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";

import { useApp } from "~/context/app";
import {
	getCompanyDetailsByCompany,
	updateCompanyDetails,
} from "~/services/system/companyDetails";
import type { CompanyDetails } from "~/types/appwrite";

const CompanyDetailsSchema = object({
	name: string(),
	legalRepresentative: string(),
	ruc: string(),
	city: string(),
	address: string(),
	phone: string(),
	mobile: string(),
	website: string(),
	email: string(),
	orderStart: number(),
	cloudStorage: optional(nullable(string())),
	mailConfig: optional(nullable(string())),
});

type CompanyDetailsForm = Omit<CompanyDetails, keyof Models.Row>;

const CompanyDetailsPage = () => {
	const { addAlert, addLoader, removeLoader } = useApp();

	const [form, { Form, Field }] = createForm<CompanyDetailsForm>({
		validate: valiForm(CompanyDetailsSchema),
		initialValues: {
			name: "",
			legalRepresentative: "",
			ruc: "",
			city: "",
			address: "",
			phone: "",
			mobile: "",
			website: "",
			email: "",
			orderStart: 0,
			cloudStorage: null,
			mailConfig: null,
		},
	});

	const [companyData] = createResource(getCompanyDetailsByCompany);

	createEffect(
		on(
			() => companyData(),
			(data) => {
				if (!data?.rows || data.rows.length === 0) return;

				const company = data.rows[0];
				setValues(form, {
					name: company.name || "",
					legalRepresentative: company.legalRepresentative || "",
					ruc: company.ruc || "",
					city: company.city || "",
					address: company.address || "",
					phone: company.phone || "",
					mobile: company.mobile || "",
					website: company.website || "",
					email: company.email || "",
					orderStart: company.orderStart ?? 0,
					cloudStorage: company.cloudStorage || null,
					mailConfig: company.mailConfig || null,
				});
			},
		),
	);

	const handleSubmit = async (values: CompanyDetailsForm) => {
		const data = companyData();
		if (!data?.rows || data.rows.length === 0) {
			addAlert({
				type: "error",
				message: "No se encontró información de la compañía",
			});
			return;
		}

		const companyId = data.rows[0].$id;
		const loaderId = addLoader();

		try {
			await updateCompanyDetails(companyId, values);
			addAlert({
				type: "success",
				message: "Información de la compañía actualizada con éxito",
			});
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al actualizar información",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Detalles de la Compañía - Grafos</Title>
			<Breadcrumb
				links={[{ label: "Sistema" }, { label: "Detalles de la Compañía" }]}
			/>
			<BlueBoard
				title="Detalles de la Compañía"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(form),
					},
				]}
			>
				<Form onSubmit={handleSubmit}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						{/* Name */}
						<div class="md:col-span-6">
							<Field name="name">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Nombre"
										placeholder="Nombre de la compañía"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Legal Representative */}
						<div class="md:col-span-6">
							<Field name="legalRepresentative">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Representante Legal"
										placeholder="Nombre del representante"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* RUC */}
						<div class="md:col-span-4">
							<Field name="ruc">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="RUC"
										placeholder="RUC de la compañía"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* City */}
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

						{/* Order Start */}
						<div class="md:col-span-4">
							<Field name="orderStart" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Número Inicial de Orden"
										placeholder="0"
										value={field.value ?? 0}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Address */}
						<div class="md:col-span-12">
							<Field name="address">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Dirección"
										placeholder="Dirección completa"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Phone */}
						<div class="md:col-span-4">
							<Field name="phone">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Teléfono"
										placeholder="Teléfono de contacto"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Mobile */}
						<div class="md:col-span-4">
							<Field name="mobile">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Móvil"
										placeholder="Número de móvil"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Email */}
						<div class="md:col-span-4">
							<Field name="email">
								{(field, props) => (
									<Input
										{...props}
										type="email"
										label="Email"
										placeholder="correo@empresa.com"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Website */}
						<div class="md:col-span-6">
							<Field name="website">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Sitio Web"
										placeholder="https://www.empresa.com"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						{/* Cloud Storage */}
						<div class="md:col-span-6">
							<Field name="cloudStorage">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Almacenamiento en la Nube"
										placeholder="Configuración de almacenamiento"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						{/* Mail Config */}
						<div class="md:col-span-12">
							<Field name="mailConfig">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Configuración de Correo"
										placeholder="Configuración de servidor de correo"
										value={field.value || ""}
										error={field.error}
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

export default CompanyDetailsPage;
