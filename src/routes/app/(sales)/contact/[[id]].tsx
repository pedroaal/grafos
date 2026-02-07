import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { nullable, number, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { listCompanies } from "~/services/sales/companies";
import {
	createContact,
	getContact,
	updateContact,
} from "~/services/sales/contacts";
import type { Companies, Contacts } from "~/types/appwrite";

const ContactSchema = object({
	title: nullable(string()),
	firstName: string(),
	lastName: string(),
	position: nullable(string()),
	address: nullable(string()),
	sector: nullable(string()),
	phone: nullable(string()),
	mobile: string(),
	extension: nullable(number()),
	email: nullable(string()),
	website: nullable(string()),
	companyId: string(),
});

type ContactForm = Omit<Contacts, keyof Models.Row | "companyId"> & {
	companyId: string;
};

const ContactPage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<ContactForm>({
		validate: valiForm(ContactSchema),
		initialValues: {
			title: null,
			firstName: "",
			lastName: "",
			position: null,
			address: null,
			sector: null,
			phone: null,
			mobile: "",
			extension: null,
			email: null,
			website: null,
			companyId: "",
		},
	});

	const [contact] = createResource(() => params.id ?? "", getContact);
	const [companies] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listCompanies,
	);

	createEffect(
		on(
			() => contact(),
			(contactData) => {
				if (!contactData || !isEdit()) return;

				setValues(form, {
					title: contactData.title,
					firstName: contactData.firstName || "",
					lastName: contactData.lastName || "",
					position: contactData.position,
					address: contactData.address,
					sector: contactData.sector,
					phone: contactData.phone,
					mobile: contactData.mobile || "",
					extension: contactData.extension,
					email: contactData.email,
					website: contactData.website,
					companyId:
						typeof contactData.companyId === "string"
							? contactData.companyId
							: (contactData.companyId?.$id ?? ""),
				});
			},
		),
	);

	const handleSubmit = async (formValues: ContactForm) => {
		const loaderId = addLoader();
		try {
			const payload = {
				...formValues,
				companyId: formValues.companyId as unknown as Companies,
			};

			if (isEdit()) {
				await updateContact(params.id!, payload);
				addAlert({
					type: "success",
					message: "Contacto actualizado con éxito",
				});
			} else {
				await createContact(payload as Contacts);
				addAlert({ type: "success", message: "Contacto creado con éxito" });
			}

			nav(Routes.contacts);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar contacto",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Contacto - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Ventas" },
					{ label: "Contactos", route: Routes.contacts },
					{
						label: contact()
							? `${contact()?.firstName} ${contact()?.lastName}`
							: "Nuevo",
					},
				]}
			/>
			<BlueBoard
				title="Gestionar Contacto"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(form),
					},
				]}
			>
				<Form onSubmit={handleSubmit}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div class="md:col-span-2">
							<Field name="title">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Título"
										placeholder="Sr./Sra."
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-5">
							<Field name="firstName">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Nombre"
										placeholder="Nombre"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-5">
							<Field name="lastName">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Apellido"
										placeholder="Apellido"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="companyId">
								{(field, props) => (
									<Select
										{...props}
										label="Empresa"
										value={field.value}
										error={field.error}
										required
									>
										<option value="">Seleccione una empresa</option>
										{companies()?.rows.map((company: Companies) => (
											<option value={company.$id}>{company.name}</option>
										))}
									</Select>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="position">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Cargo"
										placeholder="Cargo"
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="address">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Dirección"
										placeholder="Dirección"
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="sector">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Sector"
										placeholder="Sector"
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="phone">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Teléfono"
										placeholder="Teléfono"
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="mobile">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Móvil"
										placeholder="Móvil"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-2">
							<Field name="extension" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Extensión"
										placeholder="Ext."
										value={field.value ?? undefined}
										error={field.error}
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
										placeholder="email@example.com"
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="website">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Sitio Web"
										placeholder="https://example.com"
										value={field.value ?? ""}
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

export default ContactPage;
