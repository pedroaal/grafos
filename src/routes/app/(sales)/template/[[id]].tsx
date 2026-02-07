import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { nullable, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Textarea from "~/components/core/Textarea";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import {
	createTemplate,
	getTemplate,
	updateTemplate,
} from "~/services/sales/templates";
import type { Templates } from "~/types/appwrite";

const TemplateSchema = object({
	name: string(),
	content: string(),
	logo: nullable(string()),
});

type TemplateForm = Omit<Templates, keyof Models.Row>;

const TemplatePage = () => {
	const urlParams = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEditing = (): boolean => Boolean(urlParams.id);

	const [templateEditor, { Form, Field }] = createForm<TemplateForm>({
		validate: valiForm(TemplateSchema),
		initialValues: {
			name: "",
			content: "",
			logo: null,
		},
	});

	const [existingTemplate] = createResource(
		() => urlParams.id ?? "",
		getTemplate,
	);

	createEffect(
		on(
			() => existingTemplate(),
			(templateRecord) => {
				if (!templateRecord || !isEditing()) return;

				setValues(templateEditor, {
					name: templateRecord.name || "",
					content: templateRecord.content || "",
					logo: templateRecord.logo || null,
				});
			},
		),
	);

	const persistTemplate = async (formData: TemplateForm): Promise<void> => {
		const processId = addLoader();
		try {
			if (isEditing()) {
				await updateTemplate(urlParams.id!, formData as Templates);
				addAlert({
					type: "success",
					message: "Plantilla modificada correctamente",
				});
			} else {
				await createTemplate(formData as Templates);
				addAlert({
					type: "success",
					message: "Plantilla creada correctamente",
				});
			}

			nav(Routes.templates);
		} catch (errorInstance: any) {
			addAlert({
				type: "error",
				message: errorInstance.message || "Error al procesar plantilla",
			});
		} finally {
			removeLoader(processId);
		}
	};

	return (
		<>
			<Title>Plantilla - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Ventas" },
					{ label: "Plantillas", route: Routes.templates },
					{ label: existingTemplate()?.name ?? "Nueva" },
				]}
			/>
			<BlueBoard
				title="Editor de Plantilla"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(templateEditor),
					},
				]}
			>
				<Form onSubmit={persistTemplate}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div class="md:col-span-8">
							<Field name="name">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Nombre de la Plantilla"
										placeholder="Título descriptivo"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="logo">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="URL del Logo"
										placeholder="https://..."
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-12">
							<Field name="content">
								{(field, props) => (
									<Textarea
										{...props}
										label="Contenido de la Plantilla"
										placeholder="Escriba el contenido completo aquí..."
										value={field.value}
										error={field.error}
										rows={12}
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

export default TemplatePage;
