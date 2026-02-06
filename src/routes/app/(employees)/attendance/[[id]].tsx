import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import dayjs from "dayjs";
import { createEffect, createResource, on } from "solid-js";
import { nullable, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import DashboardLayout from "~/components/layouts/Dashboard";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import {
	createAttendance,
	getAttendance,
	updateAttendance,
} from "~/services/employees/attendance";
import { listUsers } from "~/services/users/users";
import type { Attendance } from "~/types/appwrite";

const AttendanceSchema = object({
	userId: string(),
	date: string(),
	morningArrival: string(),
	morningDeparture: nullable(string()),
	afternoonArrival: nullable(string()),
	afternoonDeparture: nullable(string()),
	totalHours: nullable(string()),
	overtimeHours: nullable(string()),
});

type AttendanceForm = Omit<Attendance, keyof Models.Row | "userId"> & {
	userId: string;
};

const attendanceDefault: AttendanceForm = {
	userId: "",
	date: dayjs().format("YYYY-MM-DD"),
	morningArrival: "08:00",
	morningDeparture: null,
	afternoonArrival: null,
	afternoonDeparture: null,
	totalHours: null,
	overtimeHours: null,
};

const AttendancePage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<AttendanceForm>({
		validate: valiForm(AttendanceSchema),
		initialValues: attendanceDefault,
	});

	const [users] = createResource({}, listUsers);
	const [attendance] = createResource(params.id, getAttendance);

	createEffect(
		on(
			() => attendance(),
			(attendance) => {
				if (!attendance || !isEdit()) return;

				setValues(form, {
					userId: attendance.userId?.$id || "",
					date: dayjs(attendance.date).format("YYYY-MM-DD"),
					morningArrival: attendance.morningArrival,
					morningDeparture: attendance.morningDeparture,
					afternoonArrival: attendance.afternoonArrival,
					afternoonDeparture: attendance.afternoonDeparture,
					totalHours: attendance.totalHours,
					overtimeHours: attendance.overtimeHours,
				});
			},
		),
	);

	const handleSubmit = async (values: AttendanceForm) => {
		const loader = addLoader();

		try {
			if (isEdit() && params.id) {
				await updateAttendance(params.id, values);
				addAlert({
					type: "success",
					message: "Asistencia actualizada correctamente",
				});
			} else {
				await createAttendance(values as Attendance);
				addAlert({
					type: "success",
					message: "Asistencia creada correctamente",
				});
			}
			nav(Routes.attendances);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar la asistencia",
			});
		} finally {
			removeLoader(loader);
		}
	};

	return (
		<>
			<Title>Asistencia - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Empleados" },
						{ label: "Asistencias", route: Routes.attendances },
						{ label: isEdit() ? "Editar" : "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Asistencia"
					links={[
						{
							href: Routes.attendance,
							label: "Nueva Asistencia",
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
							<div class="md:col-span-6">
								<Field name="userId">
									{(field, props) => (
										<Select
											{...props}
											options={
												users()?.rows.map((user) => ({
													key: user.$id,
													label: `${user.firstName} ${user.lastName}`,
												})) || []
											}
											label="Usuario"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-6">
								<Field name="date">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Fecha"
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
											value={field.value || ""}
											error={field.error}
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
											value={field.value || ""}
											error={field.error}
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
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="totalHours">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Horas Totales"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-6">
								<Field name="overtimeHours">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Horas Extras"
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

export default AttendancePage;
