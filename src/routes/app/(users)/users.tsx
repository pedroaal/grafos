import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import EmptyTable from "~/components/core/EmptyTable";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";

import { Routes } from "~/config/routes";
import { usePagination } from "~/hooks/usePagination";
import { listUsers } from "~/services/users/users";

const UsersPage = () => {
	const nav = useNavigate();

	const pagination = usePagination();

	const [users] = createResource(
		() => ({ page: pagination.page(), perPage: pagination.perPage() }),
		listUsers,
	);

	createEffect(() => {
		const data = users();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const goTo = (userId: string) => {
		nav(`${Routes.user}/${userId}`);
	};

	const handleDelete = (userId: string, name: string) => {};

	return (
		<>
			<Title>Usuarios - Grafos</Title>
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
				<Pagination
					page={pagination.page()}
					totalPages={pagination.totalPages()}
					totalItems={pagination.totalItems()}
					perPage={pagination.perPage()}
					onPageChange={pagination.setPage}
					onPerPageChange={pagination.setPerPage}
				/>
			</BlueBoard>
		</>
	);
};

export default UsersPage;
