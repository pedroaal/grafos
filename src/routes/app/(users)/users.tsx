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
import DashboardLayout from "~/components/layout/Dashboard";
import { Routes } from "~/config/routes";
import { useAuth } from "~/context/auth";
import { listUsers } from "~/services/users/users";

const ClientsPage = () => {
	const navigate = useNavigate();
	const { authStore } = useAuth();

	const [users] = createResource(
		() => authStore.session?.prefs.companyId || "",
		(companyId) => listUsers(companyId),
	);

	const goToUser = (userId: string) => {
		navigate(`${Routes.user}/${userId}`);
	};

	return (
		<>
			<Title>Usuarios - Grafos</Title>
			<DashboardLayout>
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold">Usuarios</h1>
				</div>

				<BlueBoard
					title="Gestiónar Usuarios"
					links={[
						{
							href: Routes.user,
							label: "Nuevo Usuario",
						},
					]}
				>
					<div class="overflow-x-auto">
						<table class="table table-zebra">
							<thead>
								<tr>
									<th class="w-1/12">Status</th>
									<th>Nombre</th>
									<th>Apellido</th>
									<th>Perfil</th>
									<th class="w-1/12"></th>
								</tr>
							</thead>
							<tbody>
								<For
									each={users()?.rows}
									fallback={
										<tr>
											<td colspan="4" class="text-center py-8">
												No hay clientes registrados. Haz clic en "Nuevo Cliente"
												para crear uno.
											</td>
										</tr>
									}
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
											<td>{item.firstName}</td>
											<td>{item.lastName}</td>
											<td>{""}</td>
											{/* <td>{item.profileId?.$id ?? ""}</td> */}
											<td>
												<div class="flex gap-2">
													<button
														type="button"
														class="btn btn-sm btn-square btn-ghost"
														onClick={[goToUser, item.$id]}
													>
														<FaSolidPencil size={16} />
													</button>
													<button
														type="button"
														class="btn btn-sm btn-square btn-ghost btn-error"
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

export default ClientsPage;
