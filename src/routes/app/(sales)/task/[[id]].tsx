import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, nullable, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import Textarea from "~/components/core/Textarea";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { listActivities } from "~/services/sales/activities";
import { listContacts } from "~/services/sales/contacts";
import { createTask, getTask, updateTask } from "~/services/sales/tasks";
import { listUsers } from "~/services/users/users";
import type { Task } from "~/types/appwrite";
import type { IOption } from "~/types/core";

const TaskSchema = object({
	scheduled: string(),
	activityId: string(),
	assignedId: string(),
	contactId: string(),
	source: nullable(string()),
	campaign: nullable(string()),
	note: nullable(string()),
	active: boolean(),
});

type TaskForm = Omit<Task, keyof Models.Row>;

const TaskPage = () => {
	const urlParams = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isUpdateMode = (): boolean => Boolean(urlParams.id);

	const [formControl, { Form, Field }] = createForm<TaskForm>({
		validate: valiForm(TaskSchema),
		initialValues: {
			scheduled: "",
			activityId: "" as any,
			assignedId: "" as any,
			contactId: "" as any,
			source: null,
			campaign: null,
			note: null,
			active: true,
		},
	});

	const [existingEntry] = createResource(() => urlParams.id ?? "", getTask);
	const [activitiesSource] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listActivities,
	);
	const [usersSource] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listUsers,
	);
	const [contactsSource] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listContacts,
	);

	createEffect(
		on(
			() => existingEntry(),
			(loadedEntry) => {
				if (!loadedEntry || !isUpdateMode()) return;

				setValues(formControl, {
					scheduled: loadedEntry.scheduled || "",
					activityId: loadedEntry.activityId.$id as any,
					assignedId: loadedEntry.assignedId.$id as any,
					contactId: loadedEntry.contactId.$id as any,
					source: loadedEntry.source || null,
					campaign: loadedEntry.campaign || null,
					note: loadedEntry.note || null,
					active: loadedEntry.active ?? true,
				});
			},
		),
	);

	const submitFormData = async (payload: TaskForm): Promise<void> => {
		const taskId = addLoader();
		try {
			if (isUpdateMode()) {
				await updateTask(urlParams.id!, payload);
				addAlert({ type: "success", message: "Tarea CRM actualizada" });
			} else {
				await createTask(payload as Task);
				addAlert({ type: "success", message: "Nueva tarea CRM creada" });
			}

			nav(Routes.tasks);
		} catch (errorObj: any) {
			addAlert({
				type: "error",
				message: errorObj.message || "Fallo al guardar tarea CRM",
			});
		} finally {
			removeLoader(taskId);
		}
	};

	const buildActivityChoices = (): IOption[] => {
		const items = activitiesSource()?.rows || [];
		return items.map((activity) => ({
			key: activity.$id,
			label: activity.name,
		}));
	};

	const buildUserChoices = (): IOption[] => {
		const items = usersSource()?.rows || [];
		return items.map((usr) => ({
			key: usr.$id,
			label: `${usr.firstName} ${usr.lastName}`,
		}));
	};

	const buildContactChoices = (): IOption[] => {
		const items = contactsSource()?.rows || [];
		return items.map((person) => ({
			key: person.$id,
			label: `${person.firstName} ${person.lastName}`,
		}));
	};

	return (
		<>
			<Title>Entrada CRM - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Ventas" },
					{ label: "CRM", route: Routes.tasks },
					{ label: isUpdateMode() ? "Modificar" : "Nueva" },
				]}
			/>
			<BlueBoard
				title="Formulario CRM"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(formControl),
					},
				]}
			>
				<Form onSubmit={submitFormData}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div class="md:col-span-6">
							<Field name="scheduled">
								{(field, props) => (
									<Input
										{...props}
										type="datetime-local"
										label="Fecha y Hora Programada"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="activityId">
								{(field, props) => (
									<Select
										{...props}
										label="Actividad"
										options={buildActivityChoices()}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="assignedId">
								{(field, props) => (
									<Select
										{...props}
										label="Asignado a Usuario"
										options={buildUserChoices()}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="contactId">
								{(field, props) => (
									<Select
										{...props}
										label="Contacto"
										options={buildContactChoices()}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="source">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Fuente"
										placeholder="Origen del contacto"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="campaign">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Campaña"
										placeholder="Nombre de campaña"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-12">
							<Field name="note">
								{(field, props) => (
									<Textarea
										{...props}
										label="Nota"
										placeholder="Observaciones adicionales"
										value={field.value || ""}
										error={field.error}
										rows={3}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-12">
							<Field name="active" type="boolean">
								{(field, props) => (
									<Checkbox
										{...props}
										label="Mantener Activo"
										checked={field.value ?? true}
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

export default TaskPage;
