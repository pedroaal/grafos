import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import {
	FaSolidArrowRightArrowLeft,
	FaSolidCheck,
	FaSolidListCheck,
	FaSolidXmark,
} from "solid-icons/fa";
import { createResource, For, Match, Switch } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import { ConfirmModal } from "~/components/core/Modal";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import DashboardLayout from "~/components/layouts/Dashboard";

import { Modals } from "~/config/modals";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { deleteOrder, listOrders } from "~/services/production/orders";

const OrdersPage = () => {
	const navigate = useNavigate();
	const { addAlert, closeModal } = useApp();

	const [orders, { refetch }] = createResource({}, listOrders);

	const goTo = (orderId: string) => {
		navigate(`${Routes.order}/${orderId}`);
	};

	const handleDelete = async (orderId: string, number: number) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la orden "${number}"? `,
		);
		if (!confirm) return;

		try {
			await deleteOrder(orderId);
			addAlert({ type: "success", message: "Orden eliminada con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar orden",
			});
		}
	};

	return (
		<>
			<Title>Pedidos - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb links={[{ label: "Produccion" }, { label: "Ordenes" }]} />
				<BlueBoard
					title="Gestionar Perfiles"
					links={[
						{
							href: Routes.order,
							label: "Nueva Orden",
						},
					]}
					modals={[
						{
							key: Modals.SearchOrder,
							label: "Buscar Orden",
						},
					]}
				>
					<Table
						headers={[
							{ label: "Estado", class: "w-1/12" },
							{ label: "Numero" },
							{ label: "Cliente" },
							{ label: "Detalle", class: "w-1/4" },
							{ label: "Cant" },
							{ label: "Procesos", class: "w-1/12" },
							{ label: "", class: "w-1/12" },
						]}
					>
						<For each={orders()?.rows || []}>
							{(item) => (
								<tr>
									<td>
										<Switch fallback={<div>Not Found</div>}>
											<Match when={item.status === "pending"}>
												<FaSolidListCheck size={24} class="text-warning" />
											</Match>
											<Match when={item.status === "paid"}>
												<FaSolidCheck size={24} class="text-success" />
											</Match>
											<Match when={item.status === "canceled"}>
												<FaSolidXmark size={24} class="text-error" />
											</Match>
											<Match when={item.status === "other"}>
												<FaSolidArrowRightArrowLeft
													size={24}
													class="text-info"
												/>
											</Match>
										</Switch>
									</td>
									<td>{item.number}</td>
									<td>{item.clientId?.companyId?.name ?? ""}</td>
									<td>{item.description}</td>
									<td>{item.quantity}</td>
									<td>{item.processes.length}</td>
									<td>
										<RowActions
											onEdit={() => goTo(item.$id)}
											onDelete={() => handleDelete(item.$id, item.number)}
										/>
									</td>
								</tr>
							)}
						</For>
					</Table>
				</BlueBoard>
				<ConfirmModal
					id={Modals.SearchOrder}
					title="Buscar Orden"
					message="Buscar orden de trabajo por numero"
					onConfirm={() => goTo("input-value")}
					onCancel={() => closeModal()}
					confirmText="Buscar"
				>
					<input class="input input-bordered input-sm w-full max-w-xs" />
				</ConfirmModal>
				<ConfirmModal
					title="Eliminar Orden"
					message="Buscar orden de trabajo por numero"
					onConfirm={() => goTo("input-value")}
				></ConfirmModal>
			</DashboardLayout>
		</>
	);
};

export default OrdersPage;
