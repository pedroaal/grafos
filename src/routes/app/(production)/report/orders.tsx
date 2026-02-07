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
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";

import { AppRoutes } from "~/config/routes";
import { listOrders } from "~/services/production/orders";

const OrdersPage = () => {
	const nav = useNavigate();

	const [orders, { refetch }] = createResource({}, listOrders);

	const goTo = (orderId: string) => {
		nav(`${AppRoutes.order}/${orderId}`);
	};

	return (
		<>
			<Title>Reporte - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Produccion" },
					{ label: "Reportes" },
					{ label: "Ordenes" },
				]}
			/>
			<BlueBoard
				title="Reporte de Ordenes"
				actions={[
					{
						label: "Imprimir",
						onClick: () => console.log("Imprimir..."),
					},
				]}
			>
				<Table
					headers={[
						{ label: "Estado", class: "w-1/12" },
						{ label: "Numero", class: "text-center" },
						{ label: "Cliente" },
						{ label: "Detalle", class: "w-1/4" },
						{ label: "Total", class: "text-center" },
						{ label: "Abonos", class: "text-center" },
						{ label: "Saldo", class: "text-center" },
						{ label: "" },
					]}
					footer={
						<tr>
							<td class="text-right" colspan={4}>
								Total $
							</td>
							<td class="text-center">0</td>
							<td class="text-center">0</td>
							<td class="text-center">0</td>
							<td></td>
						</tr>
					}
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
											<FaSolidArrowRightArrowLeft size={24} class="text-info" />
										</Match>
									</Switch>
								</td>
								<td class="text-center">{item.number}</td>
								<td>{item.clientId?.companyId?.name ?? ""}</td>
								<td>{item.description}</td>
								<td class="text-center">{item.orderTotal}</td>
								<td class="text-center">{item.balance}</td>
								<td class="text-center">{item.balance}</td>
								<td>
									<RowActions onEdit={() => goTo(item.$id)} />
								</td>
							</tr>
						)}
					</For>
				</Table>
			</BlueBoard>
		</>
	);
};

export default OrdersPage;
