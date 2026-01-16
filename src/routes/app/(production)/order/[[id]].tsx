import { createForm, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { FaSolidPlus, FaSolidTrashCan } from "solid-icons/fa";
import { createSignal, For, onCleanup } from "solid-js";
import * as v from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Table from "~/components/core/Table";
import DashboardLayout from "~/components/layout/Dashboard";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import {
	type OrderMaterials,
	type OrderPayments,
	type OrderProcesses,
	type Orders,
	OrdersStatus,
} from "~/types/appwrite";

const OrderSchema = v.object({
	number: v.number(),
	// userId: Users,
	// clientId: Clients,
	clientId: v.string(),
	startDate: v.string(),
	endDate: v.string(),
	collectionDate: v.nullable(v.string()),
	priority: v.boolean(),
	status: v.enum(OrdersStatus),
	quotedPrice: v.number(),
	description: v.string(),
	paperType: v.nullable(v.string()),
	quantity: v.number(),
	cutHeight: v.number(),
	cutWidth: v.number(),
	numberingStart: v.number(),
	numberingEnd: v.number(),
	materialTotal: v.number(),
	orderTotal: v.number(),
	paymentAmount: v.number(),
	balance: v.number(),
	notes: v.nullable(v.string()),
	deletedAt: v.nullable(v.string()),
});

type OrderForm = Omit<Orders, "$id" | "userId" | "processes">;
const ordersDefault: OrderForm = {
	number: 0,
	clientId: "",
	startDate: "",
	endDate: "",
	collectionDate: null,
	priority: false,
	status: OrdersStatus.PENDING,
	quotedPrice: 0,
	description: "",
	paperType: null,
	quantity: 0,
	cutHeight: 0,
	cutWidth: 0,
	numberingStart: 0,
	numberingEnd: 0,
	materialTotal: 0,
	orderTotal: 0,
	paymentAmount: 0,
	balance: 0,
	notes: null,
	deletedAt: null,
};

type Material = Omit<OrderMaterials, "$id" | "orderId">;
const materialDefault = {
	materialId: null,
	quantity: 0,
	cutHeight: 0,
	cutWidth: 0,
	sizes: 0,
	supplierId: null,
	invoiceNumber: null,
	total: 0,
	deletedAt: null,
};

type Process = Omit<OrderProcesses, "$id" | "orderId">;
const processDefault = {
	processId: null,
	frontColors: 0,
	backColors: 0,
	thousands: 0,
	unitPrice: 0,
	total: 0,
	done: false,
	deletedAt: null,
};

type Payment = Omit<OrderPayments, "$id" | "orderId" | "userId">;
const paymentDefault = {
	date: "",
	method: "",
	amount: 0,
	deletedAt: null,
};

const OrderPage = () => {
	const { addLoader, removeLoader, addAlert } = useApp();

	const [form, { Form, Field }] = createForm<OrderForm>({
		validate: valiForm(OrderSchema),
		initialValues: ordersDefault,
	});

	// Repeated sections
	const [materials, setMaterials] = createSignal<Material[]>([]);
	const [processes, setProcesses] = createSignal<Process[]>([]);
	const [payments, setPayments] = createSignal<Payment[]>([]);

	// totals
	const materialTotal = () =>
		materials().reduce((sum, item) => sum + (Number(item.total) || 0), 0);
	const processesTotal = () =>
		processes().reduce((sum, item) => sum + (Number(item.total) || 0), 0);
	const paymentsTotal = () =>
		payments().reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
	const total = () => processesTotal() - paymentsTotal();

	// helpers
	const addMaterial = (current?: Partial<Material>) =>
		setMaterials((prev) => [...prev, { ...materialDefault, ...current }]);
	const removeMaterial = (idx: number) =>
		setMaterials((prev) => prev.filter((_, i) => i !== idx));
	const updateMaterial = (idx: number, patch: Partial<Material>) =>
		setMaterials((prev) =>
			prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
		);

	const addProcess = (current?: Partial<Process>) =>
		setProcesses((prev) => [
			...prev,
			{
				...processDefault,
				...current,
			},
		]);
	const removeProcess = (idx: number) =>
		setProcesses((prev) => prev.filter((_, i) => i !== idx));
	const updateProcess = (idx: number, patch: Partial<Process>) =>
		setProcesses((prev) =>
			prev.map((item, i) => {
				if (i !== idx) return item;
				const updated = { ...item, ...patch };
				const tiro = Number(updated.tiro || 0);
				const retiro = Number(updated.retiro || 0);
				const millar = Number(updated.millar || 0) || 0;
				const valor = Number(updated.valor_unitario || 0);
				updated.total = +((tiro + retiro) * millar * valor).toFixed(4) || 0;
				return updated;
			}),
		);

	const addPayment = (current?: Partial<Payment>) =>
		setPayments((prev) => [
			...prev,
			{
				...paymentDefault,
				...current,
			},
		]);
	const removePayment = (idx: number) =>
		setPayments((prev) => prev.filter((_, i) => i !== idx));
	const updatePayment = (idx: number, patch: Partial<Payment>) =>
		setPayments((prev) =>
			prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
		);

	// submit
	const handleSubmit = (formValues: OrderForm) => {
		const loader = addLoader();

		try {
			// TODO: call backend service to create/update order
			console.log("Order submit", {
				formValues,
				materials: materials(),
				processes: processes(),
				payments: payments(),
			});
			addAlert({ type: "success", message: "Orden guardada (simulada)" });
		} catch (e: any) {
			addAlert({
				type: "error",
				message: e?.message || "Error guardando orden",
			});
		} finally {
			removeLoader(loader);
		}
	};

	// small cleanup if components mounted/unmounted
	onCleanup(() => {});

	return (
		<>
			<Title>Orden - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Produccion" },
						{ label: "Orden", route: Routes.orders },
						{ label: "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Orden"
					links={[
						{
							href: Routes.order,
							label: "Nueva Orden",
						},
					]}
					actions={[
						{
							onClick: () => console.log("Imprimir orden"),
							label: "Imprimir",
						},
						{
							onClick: () => console.log("Duplicar orden"),
							label: "Duplicar",
						},
						{
							form: "order-form",
							label: "Guardar",
						},
					]}
				>
					<Form id="order-form" onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-5">
								<Field name="fecha_entrada">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Inicio"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-5">
								<Field name="cliente_id">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Cliente (id)"
											placeholder="Cliente id"
											value={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-2">
								<Field name="cotizado">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Cotizado $"
											step="0.0001"
											value={String(field.value)}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="detalle">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Descripción"
											placeholder="Descripción del trabajo"
											value={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="papel">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Material (papel)"
											value={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="cantidad">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Cantidad"
											value={String(field.value)}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>
					</Form>

					{/* Materials */}
					<div class="mt-6">
						<div class="flex gap-2">
							<h6 class="font-semibold grow">Materiales</h6>
							<button
								type="button"
								class="btn btn-sm"
								onClick={[setMaterials, []]}
							>
								<FaSolidTrashCan size={16} />
							</button>
							<button
								type="button"
								class="btn btn-sm btn-ghost"
								onClick={[addMaterial, {}]}
							>
								<FaSolidPlus size={16} />
							</button>
						</div>
						<Table
							headers={[
								{ label: "" },
								{ label: "Material" },
								{ label: "Cantidad", class: "text-center" },
								{ label: "Corte A", class: "text-center" },
								{ label: "Corte An", class: "text-center" },
								{ label: "Tamaños", class: "text-center" },
								{ label: "Proveedor", class: "text-center" },
								{ label: "Factura", class: "text-center" },
								{ label: "Total", class: "text-center" },
							]}
							footer={
								<tr>
									<td colspan={8} class="text-right font-bold">
										Total material $
									</td>
									<td class="text-center font-bold">
										{materialTotal().toFixed(4)}
									</td>
								</tr>
							}
						>
							<For each={materials()}>
								{(m, i) => (
									<tr>
										<td>
											<button
												type="button"
												class="btn btn-ghost btn-sm"
												onClick={() => removeMaterial(i())}
											>
												✕
											</button>
										</td>
										<td>
											<input
												class="input input-sm w-full"
												type="text"
												value={m.material_id || ""}
												onInput={(e) =>
													updateMaterial(i(), {
														material_id: (e.target as HTMLInputElement).value,
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												value={m.cantidad || 0}
												onInput={(e) =>
													updateMaterial(i(), {
														cantidad: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												step="0.01"
												value={m.corte_alto || 0}
												onInput={(e) =>
													updateMaterial(i(), {
														corte_alto: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												step="0.01"
												value={m.corte_ancho || 0}
												onInput={(e) =>
													updateMaterial(i(), {
														corte_ancho: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												value={m.tamanios || 0}
												onInput={(e) =>
													updateMaterial(i(), {
														tamanios: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm"
												type="text"
												value={m.proveedor_id || ""}
												onInput={(e) =>
													updateMaterial(i(), {
														proveedor_id: (e.target as HTMLInputElement).value,
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												value={m.factura || 0}
												onInput={(e) =>
													updateMaterial(i(), {
														factura: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center fixFloat"
												type="number"
												step="0.0001"
												value={m.total || 0}
												onInput={(e) => {
													updateMaterial(i(), {
														total: Number((e.target as HTMLInputElement).value),
													});
												}}
											/>
										</td>
									</tr>
								)}
							</For>
						</Table>
					</div>

					{/* Processes */}
					<div class="mt-6">
						<div class="flex gap-2">
							<h6 class="font-semibold grow">Procesos</h6>
							<button
								type="button"
								class="btn btn-sm btn-ghost"
								onClick={[setProcesses, []]}
							>
								<FaSolidTrashCan size={16} />
							</button>
							<button
								type="button"
								class="btn btn-sm"
								onClick={[addProcess, {}]}
							>
								<FaSolidPlus size={16} />
							</button>
						</div>
						<Table
							headers={[
								{ label: "" },
								{ label: "Proceso" },
								{ label: "T", class: "text-center" },
								{ label: "R", class: "text-center" },
								{ label: "Mill", class: "text-center" },
								{ label: "V/U", class: "text-center" },
								{ label: "Total", class: "text-center" },
								{ label: "Terminado", class: "text-center" },
							]}
							footer={
								<tr>
									<td colspan={6} class="text-right font-bold">
										Total Pedido $
									</td>
									<td class="text-center font-bold">
										{processesTotal().toFixed(4)}
									</td>
									<td></td>
								</tr>
							}
						>
							<For each={processes()}>
								{(p, i) => (
									<tr>
										<td>
											<button
												type="button"
												class="btn btn-ghost btn-sm"
												onClick={() => removeProcess(i())}
											>
												✕
											</button>
										</td>
										<td>
											<input
												class="input input-sm"
												type="text"
												value={p.proceso_id || ""}
												onInput={(e) =>
													updateProcess(i(), {
														proceso_id: (e.target as HTMLInputElement).value,
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												value={p.tiro || 0}
												onInput={(e) =>
													updateProcess(i(), {
														tiro: Number((e.target as HTMLInputElement).value),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												value={p.retiro || 0}
												onInput={(e) =>
													updateProcess(i(), {
														retiro: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												value={p.millar || 0}
												onInput={(e) =>
													updateProcess(i(), {
														millar: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td>
											<input
												class="input input-sm text-center"
												type="number"
												step="0.0001"
												value={p.valor_unitario || 0}
												onInput={(e) =>
													updateProcess(i(), {
														valor_unitario: Number(
															(e.target as HTMLInputElement).value,
														),
													})
												}
											/>
										</td>
										<td class="text-center">{(p.total || 0).toFixed(4)}</td>
										<td class="text-center">
											<input
												type="checkbox"
												class="checkbox"
												checked={p.terminado || false}
												onChange={(e) =>
													updateProcess(i(), {
														terminado: (e.target as HTMLInputElement).checked,
													})
												}
											/>
										</td>
									</tr>
								)}
							</For>
						</Table>
					</div>

					{/* Payments */}
					<div class="mt-6">
						<div class="flex gap-2">
							<h6 class="font-semibold grow">Abonos</h6>
							<button
								type="button"
								class="btn btn-sm btn-ghost"
								onClick={[setPayments, []]}
							>
								<FaSolidTrashCan size={16} />
							</button>
							<button
								type="button"
								class="btn btn-sm"
								onClick={[addPayment, {}]}
							>
								<FaSolidPlus size={16} />
							</button>
						</div>
						<Table
							headers={[
								{ label: "" },
								{ label: "Fecha" },
								{ label: "Usuario" },
								{ label: "Forma de pago" },
								{ label: "Valor $", class: "text-right" },
							]}
							footer={
								<>
									<tr>
										<td colspan={4} class="text-right font-bold">
											Abonos $
										</td>
										<td class="text-right font-bold">
											{paymentsTotal().toFixed(4)}
										</td>
									</tr>
									<tr>
										<td colspan={4} class="text-right font-bold">
											Saldo $
										</td>
										<td class="text-right font-bold">{total().toFixed(4)}</td>
									</tr>
								</>
							}
						>
							<For each={payments()}>
								{(a, i) => (
									<tr>
										<td>
											<button
												type="button"
												class="btn btn-ghost btn-sm"
												onClick={() => removePayment(i())}
											>
												✕
											</button>
										</td>
										<td>
											<input
												type="date"
												class="input input-sm"
												value={a.fecha || ""}
												onInput={(e) =>
													updatePayment(i(), {
														fecha: (e.target as HTMLInputElement).value,
													})
												}
											/>
										</td>
										<td>
											<input
												type="text"
												class="input input-sm"
												value={a.usuario_nombre || ""}
												onInput={(e) =>
													updatePayment(i(), {
														usuario_nombre: (e.target as HTMLInputElement)
															.value,
													})
												}
											/>
										</td>
										<td>
											<input
												type="text"
												class="input input-sm"
												value={a.forma_pago || ""}
												onInput={(e) =>
													updatePayment(i(), {
														forma_pago: (e.target as HTMLInputElement).value,
													})
												}
											/>
										</td>
										<td class="text-right">
											<input
												type="number"
												class="input input-sm text-right"
												step="0.0001"
												value={a.valor || 0}
												onInput={(e) =>
													updatePayment(i(), {
														valor: Number((e.target as HTMLInputElement).value),
													})
												}
											/>
										</td>
									</tr>
								)}
							</For>
						</Table>
					</div>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default OrderPage;
