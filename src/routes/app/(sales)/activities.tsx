import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";

import { AppRoutes } from "~/config/routes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteActivity, listActivities } from "~/services/sales/activities";
import type { Activities } from "~/types/appwrite";

const ActivitiesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pageHandler = usePagination();

	const [activitiesList, { refetch: reloadActivities }] = createResource(
		() => ({
			page: pageHandler.page(),
			perPage: pageHandler.perPage(),
		}),
		listActivities,
	);

	createEffect(() => {
		const loadedData = activitiesList();
		if (loadedData) {
			pageHandler.setTotalItems(loadedData.total);
		}
	});

	const navigateToForm = (activityId: string): void => {
		nav(`${AppRoutes.activity}/${activityId}`);
	};

	const removeActivity = async (
		activityId: string,
		activityName: string,
	): Promise<void> => {
		const userApproves = window.confirm(
			`¿Eliminar la actividad "${activityName}"?`,
		);
		if (!userApproves) return;

		try {
			await deleteActivity(activityId);
			addAlert({ type: "success", message: "Actividad eliminada con éxito" });
			reloadActivities();
		} catch (errorData: any) {
			addAlert({
				type: "error",
				message: errorData.message || "No se pudo eliminar la actividad",
			});
		}
	};

	const renderFollowUpBadge = (hasFollowUp: boolean): string => {
		return hasFollowUp ? "Sí" : "No";
	};

	const renderEvaluateBadge = (canEval: boolean): string => {
		return canEval ? "Sí" : "No";
	};

	return (
		<>
			<Title>Actividades - Grafos</Title>
			<Breadcrumb links={[{ label: "Ventas" }, { label: "Actividades" }]} />
			<BlueBoard
				title="Actividades"
				links={[
					{
						href: AppRoutes.activity,
						label: "Nueva",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Nombre" },
						{ label: "Objetivo" },
						{ label: "Plantilla" },
						{ label: "Evaluable" },
						{ label: "Seguimiento" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={activitiesList()?.rows || []}>
						{(activityItem: Activities) => (
							<tr>
								<td>{activityItem.name}</td>
								<td>{activityItem.goal ?? "N/A"}</td>
								<td>{activityItem.templateId.name}</td>
								<td>
									<span
										class={
											activityItem.canEvaluate
												? "badge badge-info"
												: "badge badge-ghost"
										}
									>
										{renderEvaluateBadge(activityItem.canEvaluate)}
									</span>
								</td>
								<td>
									<span
										class={
											activityItem.followUp
												? "badge badge-success"
												: "badge badge-ghost"
										}
									>
										{renderFollowUpBadge(activityItem.followUp)}
									</span>
								</td>
								<td>
									<RowActions
										onEdit={() => navigateToForm(activityItem.$id)}
										onDelete={() =>
											removeActivity(activityItem.$id, activityItem.name)
										}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={pageHandler.page()}
					totalPages={pageHandler.totalPages()}
					totalItems={pageHandler.totalItems()}
					perPage={pageHandler.perPage()}
					onPageChange={pageHandler.setPage}
					onPerPageChange={pageHandler.setPerPage}
				/>
			</BlueBoard>
		</>
	);
};

export default ActivitiesPage;
