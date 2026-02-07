import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, nullable, number, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { AppRoutes } from "~/config/routes";
import { useApp } from "~/context/app";
import {
	createActivity,
	getActivity,
	updateActivity,
} from "~/services/sales/activities";
import { listTemplates } from "~/services/sales/templates";
import type { Activities } from "~/types/appwrite";
import type { IOption } from "~/types/core";

const ActivitySchema = object({
	name: string(),
	goal: nullable(number()),
	templateId: string(),
	canEvaluate: boolean(),
	followUp: boolean(),
});

type ActivityForm = Omit<Activities, keyof Models.Row>;

const ActivityPage = () => {
	const routeParameters = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const inEditMode = (): boolean => Boolean(routeParameters.id);

	const [activityForm, { Form, Field }] = createForm<ActivityForm>({
		validate: valiForm(ActivitySchema),
		initialValues: {
			name: "",
			goal: null,
			templateId: "" as any,
			canEvaluate: false,
			followUp: false,
		},
	});

	const [loadedActivity] = createResource(
		() => routeParameters.id ?? "",
		getActivity,
	);

	const [templatesList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listTemplates,
	);

	createEffect(
		on(
			() => loadedActivity(),
			(activityData) => {
				if (!activityData || !inEditMode()) return;

				setValues(activityForm, {
					name: activityData.name || "",
					goal: activityData.goal ?? null,
					templateId: activityData.templateId.$id as any,
					canEvaluate: activityData.canEvaluate ?? false,
					followUp: activityData.followUp ?? false,
				});
			},
		),
	);

	const handleFormSave = async (values: ActivityForm): Promise<void> => {
		const operationId = addLoader();
		try {
			if (inEditMode()) {
				await updateActivity(routeParameters.id!, values);
				addAlert({
					type: "success",
					message: "Actividad actualizada exitosamente",
				});
			} else {
				await createActivity(values as Activities);
				addAlert({ type: "success", message: "Actividad creada exitosamente" });
			}

			nav(AppRoutes.activities);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error procesando actividad",
			});
		} finally {
			removeLoader(operationId);
		}
	};

	const generateTemplateOptions = (): IOption[] => {
		const templates = templatesList()?.rows || [];
		return templates.map((tpl) => ({
			key: tpl.$id,
			label: tpl.name,
		}));
	};

	return (
		<>
			<Title>Actividad - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Ventas" },
					{ label: "Actividades", route: AppRoutes.activities },
					{ label: loadedActivity()?.name ?? "Nueva" },
				]}
			/>
			<BlueBoard
				title="Gestión de Actividad"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(activityForm),
					},
				]}
			>
				<Form onSubmit={handleFormSave}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div class="md:col-span-6">
							<Field name="name">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Nombre de Actividad"
										placeholder="Ingrese nombre"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="goal" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Objetivo"
										placeholder="Meta numérica"
										value={field.value ?? ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="templateId">
								{(field, props) => (
									<Select
										{...props}
										label="Plantilla"
										options={generateTemplateOptions()}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="canEvaluate" type="boolean">
								{(field, props) => (
									<Checkbox
										{...props}
										label="Puede ser Evaluada"
										checked={field.value ?? false}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="followUp" type="boolean">
								{(field, props) => (
									<Checkbox
										{...props}
										label="Requiere Seguimiento"
										checked={field.value ?? false}
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

export default ActivityPage;
