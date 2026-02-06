import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { number, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layouts/Dashboard";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import {
	createSchedule,
	getSchedule,
	updateSchedule,
} from "~/services/employees/schedules";
import type { Schedules } from "~/types/appwrite";

const ScheduleSchema = object({
	name: string(),
	morningArrival: string(),
	morningDeparture: string(),
	afternoonArrival: string(),
	afternoonDeparture: string(),
	waitMinutes: number(),
	graceMinutes: number(),
});

type ScheduleForm = Omit<Schedules, keyof Models.Row>;

const scheduleDefault: ScheduleForm = {
	name: "",
	morningArrival: "08:00",
	morningDeparture: "12:00",
	afternoonArrival: "14:00",
	afternoonDeparture: "18:00",
	waitMinutes: 15,
	graceMinutes: 5,
};

const SchedulePage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<ScheduleForm>({
		validate: valiForm(ScheduleSchema),
		initialValues: scheduleDefault,
	});

	const [schedule] = createResource(params.id, getSchedule);

	createEffect(
		on(
			() => schedule(),
			(schedule) => {
				if (!schedule || !isEdit()) return;

				setValues(form, {
					name: schedule.name,
					morningArrival: schedule.morningArrival,
					morningDeparture: schedule.morningDeparture,
					afternoonArrival: schedule.afternoonArrival,
					afternoonDeparture: schedule.afternoonDeparture,
					waitMinutes: schedule.waitMinutes,
					graceMinutes: schedule.graceMinutes,
				});
			},
		),
	);

	const handleSubmit = async (values: ScheduleForm) => {
		const loader = addLoader();

		try {
			if (isEdit() && params.id) {
				await updateSchedule(params.id, values);
				addAlert({
					type: "success",
					message: "Horario actualizado correctamente",
				});
			} else {
				await createSchedule(values as Schedules);
				addAlert({
					type: "success",
					message: "Horario creado correctamente",
				});
			}
			navigate(Routes.schedules);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar el horario",
			});
		} finally {
			removeLoader(loader);
		}
	};

	return (
		<>
			<Title>Horario - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Empleados" },
						{ label: "Horarios", route: Routes.schedules },
						{ label: isEdit() ? "Editar" : "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Horario"
					links={[
						{
							href: Routes.schedule,
							label: "Nuevo Horario",
							disabled: !isEdit(),
						},
					]}
					actions={[
						{
							label: "Guardar",
							onClick: () => submit(form),
						},
					]}
				>
					<Form onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-12">
								<Field name="name">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nombre"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="morningArrival">
									{(field, props) => (
										<Input
											{...props}
											type="time"
											label="Entrada Mañana"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="morningDeparture">
									{(field, props) => (
										<Input
											{...props}
											type="time"
											label="Salida Mañana"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="afternoonArrival">
									{(field, props) => (
										<Input
											{...props}
											type="time"
											label="Entrada Tarde"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="afternoonDeparture">
									{(field, props) => (
										<Input
											{...props}
											type="time"
											label="Salida Tarde"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="waitMinutes" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Minutos de Espera"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-6">
								<Field name="graceMinutes" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Minutos de Gracia"
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

export default SchedulePage;
