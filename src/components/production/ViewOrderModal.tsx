import {
	FaSolidArrowRightArrowLeft,
	FaSolidCheck,
	FaSolidListCheck,
	FaSolidXmark,
} from "solid-icons/fa";
import { createResource, For, Match, Show, Switch } from "solid-js";
import { Modal } from "~/components/core/Modal";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { formatDate } from "~/lib/date";
import { listOrderInks } from "~/services/production/orderInks";
import { listOrderMaterials } from "~/services/production/orderMaterials";
import { listOrderPayments } from "~/services/production/orderPayments";
import { listOrderProcesses } from "~/services/production/orderProcesses";
import { getOrder } from "~/services/production/orders";

interface IProps {
	onSuccess?: () => void;
}

const ViewOrderModal = (_props: IProps) => {
	const { appStore, closeModal } = useApp();

	// Fetch order data when modal opens
	const [order] = createResource(
		() =>
			appStore.showModal === Modals.ViewOrder && appStore.modalProps?.id
				? appStore.modalProps.id
				: false,
		getOrder,
	);

	// Fetch related data
	const [orderMaterials] = createResource(
		() => (order() ? { orderId: order()?.$id } : null),
		async (params) => (params ? await listOrderMaterials(params) : null),
	);

	const [orderProcesses] = createResource(
		() => (order() ? { orderId: order()?.$id } : null),
		async (params) => (params ? await listOrderProcesses(params) : null),
	);

	const [orderPayments] = createResource(
		() => (order() ? { orderId: order()?.$id } : null),
		async (params) => (params ? await listOrderPayments(params) : null),
	);

	const [orderInks] = createResource(
		() => (order() ? { orderId: order()?.$id } : null),
		async (params) => (params ? await listOrderInks(params) : null),
	);

	// Format currency
	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	};

	// Get status icon
	const StatusIcon = () => {
		const status = order()?.status;
		return (
			<Switch fallback={<div>-</div>}>
				<Match when={status === "pending"}>
					<div class="flex items-center gap-2">
						<FaSolidListCheck size={20} class="text-warning" />
						<span class="badge badge-warning">Pendiente</span>
					</div>
				</Match>
				<Match when={status === "paid"}>
					<div class="flex items-center gap-2">
						<FaSolidCheck size={20} class="text-success" />
						<span class="badge badge-success">Pagado</span>
					</div>
				</Match>
				<Match when={status === "canceled"}>
					<div class="flex items-center gap-2">
						<FaSolidXmark size={20} class="text-error" />
						<span class="badge badge-error">Cancelado</span>
					</div>
				</Match>
				<Match when={status === "other"}>
					<div class="flex items-center gap-2">
						<FaSolidArrowRightArrowLeft size={20} class="text-info" />
						<span class="badge badge-info">Otro</span>
					</div>
				</Match>
			</Switch>
		);
	};

	return (
		<Modal title={`Pedido #${order()?.number || ""}`} id={Modals.ViewOrder}>
			<Show
				when={!order.loading && order()}
				fallback={
					<div class="flex justify-center items-center py-8">
						<span class="loading loading-spinner loading-lg" />
					</div>
				}
			>
				<div class="space-y-6">
					{/* Header with Status */}
					<div class="flex items-center justify-between border-b pb-4">
						<div>
							<h4 class="text-lg font-semibold">Pedido #{order()?.number}</h4>
							<p class="text-sm text-base-content/70">
								Creado: {formatDate(order()?.$createdAt)}
							</p>
						</div>
						<StatusIcon />
					</div>

					{/* Order Summary */}
					<div class="card bg-base-200">
						<div class="card-body">
							<h3 class="card-title text-base">Resumen del Pedido</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label class="label">
										<span class="label-text font-semibold">Cliente</span>
									</label>
									<p class="text-base-content">
										{order()?.clientId?.companyId?.name || "-"}
									</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Descripción</span>
									</label>
									<p class="text-base-content">{order()?.description || "-"}</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Fecha Inicio</span>
									</label>
									<p class="text-base-content">
										{order()?.startDate ? formatDate(order()?.startDate) : "-"}
									</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Fecha Entrega</span>
									</label>
									<p class="text-base-content">
										{order()?.endDate ? formatDate(order()?.endDate) : "-"}
									</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Cantidad</span>
									</label>
									<p class="text-base-content">{order()?.quantity || 0}</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Prioridad</span>
									</label>
									<p class="text-base-content">
										{order()?.priority ? (
											<span class="badge badge-warning">Alta</span>
										) : (
											<span class="badge">Normal</span>
										)}
									</p>
								</div>
								<Show when={order()?.paperType}>
									<div>
										<label class="label">
											<span class="label-text font-semibold">
												Tipo de Papel
											</span>
										</label>
										<p class="text-base-content">{order()?.paperType}</p>
									</div>
								</Show>
								<div>
									<label class="label">
										<span class="label-text font-semibold">
											Dimensiones (Alto x Ancho)
										</span>
									</label>
									<p class="text-base-content">
										{order()?.cutHeight || 0} x {order()?.cutWidth || 0}
									</p>
								</div>
								<Show when={order()?.numberingStart || order()?.numberingEnd}>
									<div>
										<label class="label">
											<span class="label-text font-semibold">
												Numeración (Inicio - Fin)
											</span>
										</label>
										<p class="text-base-content">
											{order()?.numberingStart || 0} -{" "}
											{order()?.numberingEnd || 0}
										</p>
									</div>
								</Show>
							</div>
						</div>
					</div>

					{/* Order Processes */}
					<Show
						when={orderProcesses()?.rows && orderProcesses()?.rows.length > 0}
					>
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title text-base">Procesos</h3>
								<div class="overflow-x-auto">
									<table class="table table-sm">
										<thead>
											<tr>
												<th>Proceso</th>
												<th>Colores Frente</th>
												<th>Colores Reverso</th>
												<th>Miles</th>
												<th>Precio Unitario</th>
												<th>Total</th>
												<th>Estado</th>
											</tr>
										</thead>
										<tbody>
											<For each={orderProcesses()?.rows || []}>
												{(process) => (
													<tr>
														<td>{process.processId?.name || "-"}</td>
														<td>{process.frontColors}</td>
														<td>{process.backColors}</td>
														<td>{process.thousands}</td>
														<td>{formatCurrency(process.unitPrice)}</td>
														<td>{formatCurrency(process.total)}</td>
														<td>
															{process.done ? (
																<span class="badge badge-success badge-sm">
																	Completado
																</span>
															) : (
																<span class="badge badge-warning badge-sm">
																	Pendiente
																</span>
															)}
														</td>
													</tr>
												)}
											</For>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Show>

					{/* Order Materials */}
					<Show
						when={orderMaterials()?.rows && orderMaterials()?.rows.length > 0}
					>
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title text-base">Materiales</h3>
								<div class="overflow-x-auto">
									<table class="table table-sm">
										<thead>
											<tr>
												<th>Material</th>
												<th>Cantidad</th>
												<th>Alto</th>
												<th>Ancho</th>
												<th>Tamaños</th>
												<th>Proveedor</th>
												<th>Factura</th>
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
											<For each={orderMaterials()?.rows || []}>
												{(material) => (
													<tr>
														<td>{material.materialId?.name || "-"}</td>
														<td>{material.quantity}</td>
														<td>{material.cutHeight}</td>
														<td>{material.cutWidth}</td>
														<td>{material.sizes}</td>
														<td>{material.supplierId?.name || "-"}</td>
														<td>{material.invoiceNumber || "-"}</td>
														<td>{formatCurrency(material.total)}</td>
													</tr>
												)}
											</For>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Show>

					{/* Order Inks */}
					<Show when={orderInks()?.rows && orderInks()?.rows.length > 0}>
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title text-base">Tintas</h3>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label class="label">
											<span class="label-text font-semibold">Frente</span>
										</label>
										<div class="flex flex-wrap gap-2">
											<For
												each={
													orderInks()?.rows.filter(
														(ink) => ink.side === "front",
													) || []
												}
											>
												{(ink) => (
													<span class="badge badge-outline">
														{ink.inkId?.name || "-"}
													</span>
												)}
											</For>
											<Show
												when={
													!orderInks()?.rows.some((ink) => ink.side === "front")
												}
											>
												<span class="text-base-content/50">No hay tintas</span>
											</Show>
										</div>
									</div>
									<div>
										<label class="label">
											<span class="label-text font-semibold">Reverso</span>
										</label>
										<div class="flex flex-wrap gap-2">
											<For
												each={
													orderInks()?.rows.filter(
														(ink) => ink.side === "back",
													) || []
												}
											>
												{(ink) => (
													<span class="badge badge-outline">
														{ink.inkId?.name || "-"}
													</span>
												)}
											</For>
											<Show
												when={
													!orderInks()?.rows.some((ink) => ink.side === "back")
												}
											>
												<span class="text-base-content/50">No hay tintas</span>
											</Show>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Show>

					{/* Order Payments */}
					<Show
						when={orderPayments()?.rows && orderPayments()?.rows.length > 0}
					>
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title text-base">Pagos</h3>
								<div class="overflow-x-auto">
									<table class="table table-sm">
										<thead>
											<tr>
												<th>Fecha</th>
												<th>Método</th>
												<th>Monto</th>
											</tr>
										</thead>
										<tbody>
											<For each={orderPayments()?.rows || []}>
												{(payment) => (
													<tr>
														<td>{formatDate(payment.date)}</td>
														<td>{payment.method}</td>
														<td>{formatCurrency(payment.amount)}</td>
													</tr>
												)}
											</For>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Show>

					{/* Financial Summary */}
					<div class="card bg-base-200">
						<div class="card-body">
							<h3 class="card-title text-base">Resumen Financiero</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label class="label">
										<span class="label-text font-semibold">
											Precio Cotizado
										</span>
									</label>
									<p class="text-base-content text-lg">
										{formatCurrency(order()?.quotedPrice || 0)}
									</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">
											Total Materiales
										</span>
									</label>
									<p class="text-base-content text-lg">
										{formatCurrency(order()?.materialTotal || 0)}
									</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Total Orden</span>
									</label>
									<p class="text-base-content text-lg font-bold">
										{formatCurrency(order()?.orderTotal || 0)}
									</p>
								</div>
								<div>
									<label class="label">
										<span class="label-text font-semibold">Total Pagado</span>
									</label>
									<p class="text-base-content text-lg">
										{formatCurrency(order()?.paymentAmount || 0)}
									</p>
								</div>
								<div class="md:col-span-2">
									<label class="label">
										<span class="label-text font-semibold">Saldo</span>
									</label>
									<p
										class={`text-lg font-bold ${
											(order()?.balance || 0) > 0
												? "text-error"
												: "text-success"
										}`}
									>
										{formatCurrency(order()?.balance || 0)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Notes */}
					<Show when={order()?.notes}>
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title text-base">Notas</h3>
								<p class="text-base-content whitespace-pre-wrap">
									{order()?.notes}
								</p>
							</div>
						</div>
					</Show>

					{/* Contact Information */}
					<Show when={order()?.clientId?.contactId}>
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title text-base">Información de Contacto</h3>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Show when={order()?.clientId?.contactId?.phone}>
										<div>
											<label class="label">
												<span class="label-text font-semibold">Teléfono</span>
											</label>
											<p class="text-base-content">
												{order()?.clientId?.contactId?.phone}
											</p>
										</div>
									</Show>
									<Show when={order()?.clientId?.contactId?.mobile}>
										<div>
											<label class="label">
												<span class="label-text font-semibold">Móvil</span>
											</label>
											<p class="text-base-content">
												{order()?.clientId?.contactId?.mobile}
											</p>
										</div>
									</Show>
								</div>
							</div>
						</div>
					</Show>
				</div>

				{/* Modal Footer */}
				<div class="modal-action">
					<button type="button" class="btn" onClick={closeModal}>
						Cerrar
					</button>
				</div>
			</Show>
		</Modal>
	);
};

export default ViewOrderModal;
