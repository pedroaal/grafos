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
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteProfile, listProfiles } from "~/services/users/profiles";

const ProfilesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();

	const pagination = usePagination();

	const [profiles, { refetch }] = createResource(
		() => ({ page: pagination.page(), perPage: pagination.perPage() }),
		listProfiles,
	);

	createEffect(() => {
		const data = profiles();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const goTo = (profileId: string) => {
		nav(`${Routes.profile}/${profileId}`);
	};

	const handleDelete = async (profileId: string, name: string) => {
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
			<Breadcrumb links={[{ label: "Usuarios" }, { label: "Perfiles" }]} />
			<BlueBoard
				title="Gestionar Perfiles"
				links={[
					{
						href: Routes.profile,
						label: "Nuevo Perfil",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Activo", class: "w-1/12" },
						{ label: "Nombre" },
						{ label: "Descripción" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={profiles()?.rows} fallback={<EmptyTable colspan={4} />}>
						{(item) => (
							<tr>
								<td>
									<TrueFalse value={item.active} color />
								</td>
								<td>{item.name}</td>
								<td>{item.description}</td>
								<td>
									<RowActions
										onEdit={() => goTo(item.$id)}
										onDelete={() => handleDelete(item.$id, item.name)}
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

export default ProfilesPage;
