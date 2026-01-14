import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import {
	FaSolidCheck,
	FaSolidPencil,
	FaSolidTrash,
	FaSolidXmark,
} from "solid-icons/fa";
import { createResource, For } from "solid-js";
import BlueBoard from "~/components/core/BlueBoard";
import EmptyTable from "~/components/core/EmptyTable";
import DashboardLayout from "~/components/layout/Dashboard";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { deleteProfile, listProfiles } from "~/services/users/profiles";

const ProfilesPage = () => {
	const navigate = useNavigate();
	const { authStore } = useAuth();
	const { addAlert } = useApp();

	const [profiles, { refetch }] = createResource(
		() => authStore.user?.tenantId || "",
		(tenantId) => listProfiles(tenantId),
	);

	const goToProfile = (profileId: string) => {
		navigate(`${Routes.profile}/${profileId}`);
	};

	const handleDelete = async ({
		profileId,
		name,
	}: {
		profileId: string;
		name: string;
	}) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el perfil "${name}"? `,
		);
		if (!confirm) return;

		try {
			await deleteProfile(profileId);
			addAlert({ type: "success", message: "Perfil eliminado con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar perfil",
			});
		}
	};

	return (
		<>
			<Title>Perfiles - Grafos</Title>
			<DashboardLayout>
				<BlueBoard
					title="Gestionar Perfiles"
					links={[
						{
							href: Routes.profile,
							label: "Nuevo Perfil",
						},
					]}
				>
					<div class="overflow-x-auto">
						<table class="table table-zebra">
							<thead>
								<tr>
									<th class="w-1/12">Status</th>
									<th>Nombre</th>
									<th>Descripción</th>
									<th class="w-1/12" />
								</tr>
							</thead>
							<tbody>
								<For
									each={profiles()?.rows}
									fallback={<EmptyTable colspan={4} />}
								>
									{(item) => (
										<tr>
											<td>
												{item.status ? (
													<FaSolidCheck size={24} class="text-success" />
												) : (
													<FaSolidXmark size={24} class="text-error" />
												)}
											</td>
											<td>{item.name}</td>
											<td>{item.description}</td>
											<td>
												<div class="flex gap-2">
													<button
														type="button"
														class="btn btn-sm btn-square btn-ghost"
														onClick={[goToProfile, item.$id]}
													>
														<FaSolidPencil size={16} />
													</button>
													<button
														type="button"
														class="btn btn-sm btn-square btn-ghost btn-error"
														onClick={[
															handleDelete,
															{ profileId: item.$id, name: item.name },
														]}
													>
														<FaSolidTrash size={16} />
													</button>
												</div>
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

export default ProfilesPage;
