import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layouts/Dashboard";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import {
	createEquipment,
	getEquipment,
	updateEquipment,
} from "~/services/employees/equipment";
import type { Equipment } from "~/types/appwrite";

const EquipmentSchema = object({
	name: string(),
	active: boolean(),
});

type EquipmentForm = Omit<Equipment, keyof Models.Row>;

const equipmentDefault: EquipmentForm = {
	name: "",
	active: true,
};

const EquipmentItemPage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<EquipmentForm>({
		validate: valiForm(EquipmentSchema),
		initialValues: equipmentDefault,
	});

	const [equipment] = createResource(params.id, getEquipment);

	createEffect(
		on(
			() => equipment(),
			(equipment) => {
				if (!equipment || !isEdit()) return;

				setValues(form, {
					name: equipment.name,
					active: equipment.active,
				});
			},
		),
	);

	const handleSubmit = async (values: EquipmentForm) => {
		const loader = addLoader();

		try {
			if (isEdit() && params.id) {
				await updateEquipment(params.id, values);
				addAlert({
					type: "success",
					message: "Equipo actualizado correctamente",
				});
			} else {
				await createEquipment(values as Equipment);
				addAlert({
					type: "success",
					message: "Equipo creado correctamente",
				});
			}
			navigate(Routes.equipment);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar el equipo",
			});
		} finally {
			removeLoader(loader);
		}
	};

	return (
		<>
			<Title>Equipo - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Empleados" },
						{ label: "Equipos", route: Routes.equipment },
						{ label: isEdit() ? "Editar" : "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Equipo"
					links={[
						{
							href: Routes.equipmentItem,
							label: "Nuevo Equipo",
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
							<div class="md:col-span-10">
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
							<div class="md:col-span-2 flex items-end pb-2">
								<Field name="active" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Activo"
											checked={field.value}
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

export default EquipmentItemPage;
