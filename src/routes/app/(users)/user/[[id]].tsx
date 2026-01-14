import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, on } from "solid-js";
import { boolean, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import DashboardLayout from "~/components/layout/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { createAccount } from "~/services/users/accounts";
import { listProfiles } from "~/services/users/profiles";
import { createUser, getUser, updateUser } from "~/services/users/users";
import type { Users } from "~/types/appwrite";

const UserSchema = object({
	idNumber: string(),
	firstName: string(),
	lastName: string(),
	profileId: string(),
	status: boolean(),
	reserveOrder: boolean(),
	bookAccess: boolean(),
	profitAccess: boolean(),
	isSuperAdmin: boolean(),
});

type UserForm = Omit<
	Users,
	"authId" | "tenantId" | "deletedAt" | "profileId"
> & { profileId: string };

const UserPage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<UserForm>({
		validate: valiForm(UserSchema),
		initialValues: {
			idNumber: "",
			firstName: "",
			lastName: "",
			profileId: "",
			status: true,
			reserveOrder: false,
			bookAccess: false,
			profitAccess: false,
			isSuperAdmin: false,
		},
	});

	const [user] = createResource(() => params.id ?? "", getUser);
	const [profiles] = createResource(
		() => authStore.user?.tenantId || "",
		listProfiles,
	);

	const profileOptions = () => {
		return (
			profiles()?.rows.map((profile) => ({
				key: profile.$id,
				label: profile.name,
			})) || []
		);
	};

	createEffect(
		on(
			() => user(),
			(user) => {
				if (!user || !isEdit()) return;

				setValues(form, {
					idNumber: user.idNumber,
					profileId: user.profileId ?? "",
					firstName: user.firstName,
					lastName: user.lastName,
					status: user.status,
					reserveOrder: user.reserveOrder,
					bookAccess: user.bookAccess,
					profitAccess: user.profitAccess,
					isSuperAdmin: user.isSuperAdmin,
				});
			},
		),
	);

	const handleSubmit = async (formValues: UserForm) => {
		const loaderId = addLoader();

		try {
			const payload = {
				...formValues,
				tenantId: authStore.user?.tenantId || "",
				deletedAt: null,
			};

			if (isEdit()) {
				await updateUser(params.id!, payload);
				addAlert({ type: "success", message: "Usuario actualizado con éxito" });
			} else {
				debugger;
				const authId = await createAccount(
					"pedro@altamirano.me",
					"andres72257225",
				);
				await createUser({ ...payload, authId } as Users);
				addAlert({ type: "success", message: "Usuario creado con éxito" });
			}

			navigate(Routes.users);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar usuario",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Usuario - Grafos</Title>
			<DashboardLayout>
				<BlueBoard
					title="Gesitonar Usuario"
					actions={[
						{
							label: "Guardar",
							form: "userForm",
						},
					]}
				>
					<Form id="userForm" onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="md:col-span-2">
								<Field name="idNumber">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Cedula"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
								<Field name="firstName">
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
								<Field name="lastName">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Apellido"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
								<Field name="profileId">
									{(field, props) => (
										<Select
											{...props}
											options={profileOptions()}
											label="Perfil"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-1">
								<Field name="status" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Activo"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
								<Field name="reserveOrder" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Reservar Ordenes"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
								<Field name="bookAccess" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Libros"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
								<Field name="profitAccess" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Utilidades"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
								<Field name="isSuperAdmin" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Administrador"
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

export default UserPage;
