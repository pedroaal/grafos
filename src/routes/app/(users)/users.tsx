import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import EmptyTable from "~/components/core/EmptyTable";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";
import DashboardLayout from "~/components/layouts/Dashboard";

import { Routes } from "~/config/routes";
import { listUsers } from "~/services/users/users";

const UsersPage = () => {
	const navigate = useNavigate();

	const [users] = createResource({}, listUsers);

	const goTo = (userId: string) => {
		navigate(`${Routes.user}/${userId}`);
	};

	const handleDelete = (userId: string, name: string) => {};

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
							{ label: "Activo", class: "w-1/12" },
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
										<TrueFalse value={item.active} color />
									</td>
									<td>{item.firstName}</td>
									<td>{item.lastName}</td>
									<td>{item.profileId?.name || ""}</td>
									<td>
										<RowActions
											onEdit={() => goTo(item.$id)}
											onDelete={() => handleDelete(item.$id, item.firstName)}
										/>
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
