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
import Breadcrumb from "~/components/core/Breadcrumb";
import EmptyTable from "~/components/core/EmptyTable";
import Table from "~/components/core/Table";
import DashboardLayout from "~/components/layout/Dashboard";
import { Routes } from "~/config/routes";
import { listUsers } from "~/services/users/users";

const UsersPage = () => {
	const navigate = useNavigate();

	const [users] = createResource(listUsers);

	const goToUser = (userId: string) => {
		navigate(`${Routes.user}/${userId}`);
	};

	return (
		<>
			<Title>Usuarios - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb links={[{ label: "Usuarios" }, { label: "Usuarios" }]} />
				<BlueBoard
					title="Gestiónar Usuarios"
					links={[
						{
							href: Routes.user,
							label: "Nuevo Usuario",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Status", class: "w-1/12" },
							{ label: "Nombre" },
							{ label: "Apellido" },
							{ label: "Perfil" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={users()?.rows} fallback={<EmptyTable colspan={5} />}>
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
									<td>{item.profileId?.name || ""}</td>
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
					</Table>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default UsersPage;
