import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, enum as vEnum, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Select from "~/components/core/Select";
import DashboardLayout from "~/components/layouts/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { ClientsTaxpayerType, type Clients } from "~/types/appwrite.d";
import {
	createClient,
	getClient,
	updateClient,
} from "~/services/sales/clients";
import { listCompanies } from "~/services/sales/companies";
import { listContacts } from "~/services/sales/contacts";
import type { IOption } from "~/types/core";

const ClientFormSchema = object({
	contactId: string(),
	companyId: string(),
	followUp: boolean(),
	taxpayerType: vEnum(ClientsTaxpayerType),
});

type ClientFormData = Omit<Clients, keyof Models.Row>;

const ClientFormPage = () => {
	const routeParams = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const editMode = (): boolean => Boolean(routeParams.id);

	const [formInstance, { Form, Field }] = createForm<ClientFormData>({
		validate: valiForm(ClientFormSchema),
		initialValues: {
			contactId: "" as any,
			companyId: "" as any,
			followUp: false,
			taxpayerType: ClientsTaxpayerType.PERSON_NON_OBLIGATED,
		},
	});

	const [clientInfo] = createResource(
		() => routeParams.id ?? "",
		getClient,
	);

	const [contactsList] = createResource(
		() => ({ page: 1, perPage: 100 }),
		listContacts,
	);

	const [companiesList] = createResource(
		() => ({ page: 1, perPage: 100 }),
		listCompanies,
	);

	createEffect(
		on(
			() => clientInfo(),
			(fetchedClient) => {
				if (!fetchedClient || !editMode()) return;

				setValues(formInstance, {
					contactId: fetchedClient.contactId.$id as any,
					companyId: fetchedClient.companyId.$id as any,
					followUp: fetchedClient.followUp ?? false,
					taxpayerType: fetchedClient.taxpayerType,
				});
			},
		),
	);

	const processSubmit = async (formData: ClientFormData): Promise<void> => {
		const loadingId = addLoader();
		try {
			if (editMode()) {
				await updateClient(routeParams.id!, formData);
				addAlert({ type: "success", message: "Cliente modificado correctamente" });
			} else {
				await createClient(formData as Clients);
				addAlert({ type: "success", message: "Cliente registrado correctamente" });
			}

			nav(Routes.clients);
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Error al procesar el cliente",
			});
		} finally {
			removeLoader(loadingId);
		}
	};

	const buildContactOptions = (): IOption[] => {
		const contacts = contactsList()?.rows || [];
		return contacts.map((c) => ({
			key: c.$id,
			label: `${c.firstName} ${c.lastName}`,
		}));
	};

	const buildCompanyOptions = (): IOption[] => {
		const companies = companiesList()?.rows || [];
		return companies.map((comp) => ({
			key: comp.$id,
			label: comp.name,
		}));
	};

	const taxpayerOptions: IOption[] = [
		{ key: ClientsTaxpayerType.PERSON_NON_OBLIGATED, label: "Persona No Obligada" },
		{ key: ClientsTaxpayerType.PERSON_OBLIGATED, label: "Persona Obligada" },
		{ key: ClientsTaxpayerType.PUBLIC_SOCIETY, label: "Sociedad Pública" },
		{ key: ClientsTaxpayerType.PRIVATE_SOCIETY, label: "Sociedad Privada" },
	];

	return (
		<>
			<Title>Cliente - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Ventas" },
						{ label: "Clientes", route: Routes.clients },
						{ label: editMode() ? "Editar" : "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Formulario de Cliente"
					actions={[
						{
							label: "Guardar",
							onClick: () => submit(formInstance),
						},
					]}
				>
					<Form onSubmit={processSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-6">
								<Field name="contactId">
									{(field, props) => (
										<Select
											{...props}
											label="Contacto"
											options={buildContactOptions()}
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
											options={buildCompanyOptions()}
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="taxpayerType">
									{(field, props) => (
										<Select
											{...props}
											label="Tipo de Contribuyente"
											options={taxpayerOptions}
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6 flex items-end">
								<Field name="followUp" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Activar Seguimiento"
											checked={field.value ?? false}
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

export default ClientFormPage;
