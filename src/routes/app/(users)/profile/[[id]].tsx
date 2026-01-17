import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, on } from "solid-js";
import { boolean, object, string } from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layout/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { listFeatures } from "~/services/users/features";
import {
	listProfileFeatures,
	syncProfileFeatures,
} from "~/services/users/profileFeatures";
import {
	createProfile,
	getProfile,
	updateProfile,
} from "~/services/users/profiles";
import type { Features, Profiles } from "~/types/appwrite";

const ProfileSchema = object({
	name: string(),
	description: string(),
	active: boolean(),
});

type ProfileForm = Omit<Profiles, "$id">;

const ProfilePage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [selectedFeatures, setSelectedFeatures] = createSignal<Array<string>>(
		[],
	);

	const [form, { Form, Field }] = createForm<ProfileForm>({
		validate: valiForm(ProfileSchema),
		initialValues: {
			name: "",
			description: "",
			active: true,
		},
	});

	const [features] = createResource(listFeatures);
	const [profile] = createResource(() => params.id ?? "", getProfile);
	const [profileFeatures] = createResource(
		() => params.id ?? "",
		listProfileFeatures,
	);

	createEffect(
		on(
			() => profile(),
			(profileData) => {
				if (!profileData || !isEdit()) return;

				setValues(form, {
					name: profileData.name || "",
					description: profileData.description || "",
					active: profileData.active ?? true,
				});
			},
		),
	);

	createEffect(
		on(
			() => profileFeatures(),
			(profileFeatures) => {
				if (!profileFeatures?.rows || !isEdit()) return;

				const features =
					profileFeatures?.rows.map((item) => item.featureId) || [];
				setSelectedFeatures(features);
			},
		),
	);

	const handleCheckboxChange = (featureId: string) => {
		setSelectedFeatures((state) => {
			if (state.includes(featureId)) {
				return state.filter((item) => item !== featureId);
			}

			state.push(featureId);
			return state;
		});
	};

	const toggleAll = () => {
		const allFeatures = features()?.rows?.map((item) => item.$id) || [];
		setSelectedFeatures((prev) =>
			prev.length >= allFeatures.length ? [] : allFeatures,
		);
	};

	const handleSubmit = async (formValues: ProfileForm) => {
		const loaderId = addLoader();
		try {
			let profileId: string;

			if (isEdit()) {
				await updateProfile(params.id!, formValues);
				profileId = params.id!;
				addAlert({ type: "success", message: "Perfil actualizado con éxito" });
			} else {
				const newProfile = await createProfile(
					authStore.tenantId!,
					formValues as Profiles,
				);
				profileId = newProfile.$id;
				addAlert({ type: "success", message: "Perfil creado con éxito" });
			}

			await syncProfileFeatures(profileId, selectedFeatures());

			navigate(Routes.profiles);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar perfil",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Perfil - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Usuarios" },
						{ label: "Perfiles", route: Routes.profiles },
						{ label: profile()?.name ?? "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Perfil"
					actions={[
						{
							label: "Guardar",
							form: "profileForm",
						},
					]}
				>
					{/* Basic Info */}
					<Form id="profileForm" onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-5">
								<Field name="name">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nombre"
											placeholder="Nombre del perfil"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="description">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Descripción"
											placeholder="Descripción del perfil"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-1 flex items-end">
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

					{/* Features Permissions Table */}
					<div class="overflow-x-auto">
						<table class="table table-zebra table-sm">
							<thead>
								<tr>
									<th class="w-2/5">Feature</th>
									<th class="w-15 text-center">
										<button
											type="button"
											class="btn btn-xs btn-ghost"
											onClick={() => toggleAll()}
										>
											Seleccionar Todos
										</button>
									</th>
								</tr>
							</thead>
							<tbody>
								<For each={features()?.rows}>
									{(item: Features) => (
										<tr>
											<td classList={{ "pl-10": !item.isMain }}>{item.name}</td>
											<td class="text-center">
												<input
													type="checkbox"
													class="checkbox checkbox-sm"
													checked={selectedFeatures().includes(item.$id)}
													onChange={() => handleCheckboxChange(item.$id)}
												/>
											</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default ProfilePage;
