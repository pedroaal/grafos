import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { createAsync, useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import dayjs from "dayjs";
import { createEffect, createResource, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import {
	boolean,
	nullable,
	number,
	object,
	string,
	enum as venum,
} from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import MultiSelect from "~/components/core/Multiselect";
import Select from "~/components/core/Select";
import MaterialsSection, {
	type MaterialForm,
} from "~/components/production/MaterialsSection";
import PaymentsSection, {
	type PaymentForm,
} from "~/components/production/PaymentsSection";
import ProcessesSection, {
	type ProcessForm,
} from "~/components/production/ProcessesSection";
import { OrdersStatus } from "~/config/appwrite";
import { AppRoutes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { listInks } from "~/services/production/inks";
import { listOrderInks, syncOrderInks } from "~/services/production/orderInks";
import {
	listOrderMaterials,
	syncOrderMaterials,
} from "~/services/production/orderMaterials";
import {
	listOrderPayments,
	syncOrderPayments,
} from "~/services/production/orderPayments";
import {
	listOrderProcesses,
	syncOrderProcesses,
} from "~/services/production/orderProcesses";
import {
	createOrder,
	duplicateOrder,
	getOrder,
	getOrderNumber,
	updateOrder,
} from "~/services/production/orders";
import { listClients } from "~/services/sales/clients";
import type { Contacts, Orders } from "~/types/appwrite";
import type { IInks, ITotals } from "~/types/orders";

const OrderSchema = object({
	number: number(),
	clientId: string(),
	startDate: string(),
	endDate: string(),
	// collectionDate: nullable(string()),
	priority: boolean(),
	status: venum(OrdersStatus),
	quotedPrice: number(),
	description: string(),
	paperType: nullable(string()),
	quantity: number(),
	cutHeight: number(),
	cutWidth: number(),
	numberingStart: number(),
	numberingEnd: number(),
	// materialTotal: number(),
	// orderTotal: number(),
	// paymentAmount: number(),
	// balance: number(),
	notes: nullable(string()),
});

type OrderForm = Omit<
	Orders,
	keyof Models.Row | "userId" | "processes" | "clientId"
> & {
	clientId: string;
};
const ordersDefault = {
	number: 0,
	clientId: "",
	startDate: dayjs().format("YYYY-MM-DD"),
	endDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
	// collectionDate: null,
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
	// materialTotal: 0,
	// orderTotal: 0,
	// paymentAmount: 0,
	// balance: 0,
	notes: null,
};

const OrderPage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);
	const orderStatuses = () => [
		{ key: OrdersStatus.PENDING, label: "Pendiente" },
		{ key: OrdersStatus.PAID, label: "Pagado" },
		{ key: OrdersStatus.CANCELED, label: "Cancelado" },
		{ key: OrdersStatus.OTHER, label: "Otro" },
	];

	const [form, { Form, Field }] = createForm<OrderForm>({
		validate: valiForm(OrderSchema),
		initialValues: ordersDefault,
	});

	const [clients] = createResource({}, listClients);
	const [phone, setPhone] = createSignal<string>("");
	const [inksData] = createResource({}, listInks);

	const inkOptions = () =>
		inksData()?.rows.map((ink) => ({
			key: ink.$id,
			label: ink.color,
		})) || [];

	const [orderNumber] = createResource(getOrderNumber);
	const [order] = createResource(params.id, getOrder);
	const [orderInks] = createResource(
		{ orderId: params.id || "" },
		listOrderInks,
	);
	const [orderMaterials] = createResource(
		{ orderId: params.id || "" },
		listOrderMaterials,
	);
	const [orderProcesses] = createResource(
		{ orderId: params.id || "" },
		listOrderProcesses,
	);
	const [orderPayments] = createResource(
		{ orderId: params.id || "" },
		listOrderPayments,
	);

	const [inks, setInks] = createStore<IInks>({
		front: [],
		back: [],
	});
	const [materials, setMaterials] = createStore<MaterialForm[]>([]);
	const [processes, setProcesses] = createStore<ProcessForm[]>([]);
	const [payments, setPayments] = createStore<PaymentForm[]>([]);
	const [totals, setTotals] = createStore<ITotals>({
		materials: 0,
		processes: 0,
		payments: 0,
		balance: 0,
	});

	const formatClientPhone = (contact: Partial<Contacts>) =>
		[contact?.phone, contact?.mobile].filter(Boolean).join(" / ");

	createEffect(
		on(
			() => orderNumber(),
			(orderNumber) => {
				if (!orderNumber || isEdit()) return;

				setValues(form, {
					number: orderNumber + 1,
				});
			},
		),
	);

	createEffect(
		on(
			() => order(),
			(order) => {
				if (!order || !isEdit()) return;
				setValues(form, {
					number: order.number,
					clientId: order.clientId.$id || "",
					startDate: dayjs(order.startDate).format("YYYY-MM-DD"),
					endDate: dayjs(order.endDate).format("YYYY-MM-DD"),
					collectionDate: dayjs(order.collectionDate).format("YYYY-MM-DD"),
					priority: order.priority,
					status: order.status,
					quotedPrice: order.quotedPrice,
					description: order.description,
					paperType: order.paperType,
					quantity: order.quantity,
					cutHeight: order.cutHeight,
					cutWidth: order.cutWidth,
					numberingStart: order.numberingStart,
					numberingEnd: order.numberingEnd,
					materialTotal: order.materialTotal,
					orderTotal: order.orderTotal,
					paymentAmount: order.paymentAmount,
					balance: order.balance,
					notes: order.notes,
				});
				setPhone(formatClientPhone(order.clientId?.contactId));
				setTotals({
					materials: order.materialTotal,
					processes: order.orderTotal,
					payments: order.paymentAmount,
					balance: order.balance,
				});
			},
		),
	);

	createEffect(
		on(
			() => orderInks(),
			(orderInk) => {
				if (!orderInk || !isEdit()) return;
				const front: string[] = [];
				const back: string[] = [];
				for (const item of orderInk.rows) {
					if (item.side === "front") {
						front.push(item.inkId || "");
					} else if (item.side === "back") {
						back.push(item.inkId || "");
					}
				}
				setInks({ front, back });
			},
		),
	);

	createEffect(
		on(
			() => orderMaterials(),
			(orderMaterial) => {
				if (!orderMaterial || !isEdit()) return;
				const data: MaterialForm[] = orderMaterial.rows.map((item) => ({
					$id: item.$id,
					materialId: item.materialId || "",
					quantity: item.quantity,
					cutHeight: item.cutHeight,
					cutWidth: item.cutWidth,
					sizes: item.sizes,
					supplierId: item.supplierId || "",
					invoiceNumber: item.invoiceNumber,
					total: item.total,
				}));
				setMaterials(data);
			},
		),
	);

	createEffect(
		on(
			() => orderProcesses(),
			(orderProcesses) => {
				if (!orderProcesses || !isEdit()) return;
				const data: ProcessForm[] = orderProcesses.rows.map((item) => ({
					$id: item.$id,
					processId: item.processId || "",
					frontColors: item.frontColors,
					backColors: item.backColors,
					thousands: item.thousands,
					unitPrice: item.unitPrice,
					total: item.total,
					done: item.done,
				}));
				setProcesses(data);
			},
		),
	);

	createEffect(
		on(
			() => orderPayments(),
			(orderPayments) => {
				if (!orderPayments || !isEdit()) return;
				const data: PaymentForm[] = orderPayments.rows.map((item) => ({
					$id: item.$id,
					date: item.date,
					method: item.method,
					amount: item.amount,
				}));
				setPayments(data);
			},
		),
	);

	const handleSubmit = async (formValues: OrderForm) => {
		const loader = addLoader();

		try {
			const tenantId = authStore?.tenantId;
			if (!tenantId) throw new Error("No hay sesión de tenant");

			const userId = authStore?.user?.$id;
			if (!userId) throw new Error("No hay sesión de usuario");

			// Prepare order payload
			const orderPayload = {
				...formValues,
				userId: userId,
				collectionDate:
					formValues.status === OrdersStatus.PAID
						? dayjs().format("YYYY-MM-DD")
						: undefined,
				materialTotal: totals.materials,
				orderTotal: totals.processes,
				paymentAmount: totals.payments,
				balance: totals.balance,
			};

			let orderId = params.id || "";
			if (isEdit() && params.id) {
				await updateOrder(params.id, orderPayload);
			} else {
				const createdOrder = await createOrder(tenantId, orderPayload);
				orderId = createdOrder.$id;
			}

			const frontInks = inks.front.map((ink) => ({
				inkId: ink,
				side: "front",
			}));
			const backInks = inks.back.map((ink) => ({ inkId: ink, side: "back" }));

			await Promise.all([
				syncOrderInks(orderId, [...frontInks, ...backInks]),
				syncOrderMaterials(orderId, materials),
				syncOrderProcesses(orderId, processes),
				syncOrderPayments(orderId, payments),
			]);

			addAlert({ type: "success", message: "Orden guardada correctamente" });
			nav(AppRoutes.orders);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar la orden",
			});
		} finally {
			removeLoader(loader);
		}
	};

	return (
		<>
			<Title>Orden - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Produccion" },
					{ label: "Ordenes", route: AppRoutes.orders },
					{ label: "Nuevo" },
				]}
			/>
			<BlueBoard
				title="Gestionar Orden"
				links={[
					{
						href: AppRoutes.order,
						label: "Nueva Orden",
						disabled: !isEdit(),
					},
				]}
				actions={[
					{
						onClick: () => {
							// TODO: Implement print functionality
						},
						label: "Imprimir",
						disabled: !isEdit(),
					},
					{
						onClick: () =>
							duplicateOrder(params.id || "", authStore?.tenantId!),
						label: "Duplicar",
						disabled: !isEdit(),
					},
					{
						label: "Guardar",
						onClick: () => submit(form),
					},
				]}
			>
				<Form onSubmit={handleSubmit}>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div class="md:col-span-3">
							<Field name="number" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Numero"
										value={field.value}
										error={field.error}
										required
										readOnly
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-7"></div>
						<div class="md:col-span-2">
							<Field name="quotedPrice" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Cotizado $"
										step="0.01"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="startDate">
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
						<div class="md:col-span-3">
							<Field name="endDate">
								{(field, props) => (
									<Input
										{...props}
										type="date"
										label="Fin"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2"></div>
						<div class="md:col-span-2 flex items-end pb-2">
							<Field name="priority" type="boolean">
								{(field, props) => (
									<Checkbox
										{...props}
										label="Prioritario"
										checked={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2">
							<Field name="status">
								{(field, props) => (
									<Select
										{...props}
										options={orderStatuses()}
										label="Estado"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="clientId">
								{(field, props) => (
									<Select
										{...props}
										options={
											clients()?.rows.map((client) => ({
												key: client.$id,
												label:
													`${client.contactId?.firstName} ${client.contactId?.lastName} (${client.companyId?.name})` ||
													"",
											})) || []
										}
										label="Cliente"
										value={field.value}
										error={field.error}
										onChange={(ev) => {
											props.onChange(ev);
											const value = (ev.target as HTMLSelectElement).value;
											const client = clients()?.rows.find(
												(client) => client.$id === value,
											);
											setPhone(formatClientPhone(client?.contactId || {}));
										}}
										required
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-4">
							<Input
								name="clientPhone"
								type="text"
								label="Telefono"
								value={phone()}
								readOnly
							/>
						</div>
						<div class="md:col-span-2"></div>

						<div class="md:col-span-10">
							<Field name="description">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Descripción"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2">
							<Field name="quantity" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Cantidad"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-4">
							<Field name="paperType">
								{(field, props) => (
									<Input
										{...props}
										type="text"
										label="Material (papel)"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2">
							<Field name="cutHeight" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Corte A"
										step="0.1"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2">
							<Field name="cutWidth" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Corte An"
										step="0.1"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2">
							<Field name="numberingStart" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Numerado Inicio"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>
						<div class="md:col-span-2">
							<Field name="numberingEnd" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Numerado Fin"
										value={field.value}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<MultiSelect
								name="frontInks"
								options={inkOptions()}
								label="Tintas tiro"
								value={inks.front}
								onChange={(values) => setInks("front", values)}
							/>
						</div>
						<div class="md:col-span-6">
							<MultiSelect
								name="backInks"
								options={inkOptions()}
								label="Tintas retiro"
								value={inks.back}
								onChange={(values) => setInks("back", values)}
							/>
						</div>
					</div>

					<MaterialsSection
						state={materials}
						setState={setMaterials}
						totals={totals}
						setTotals={setTotals}
					/>

					<ProcessesSection
						state={processes}
						setState={setProcesses}
						totals={totals}
						setTotals={setTotals}
					/>

					<PaymentsSection
						state={payments}
						setState={setPayments}
						totals={totals}
						setTotals={setTotals}
					/>

					<Field name="notes">
						{(field, props) => (
							<Input
								{...props}
								label="Notas"
								value={field.value || ""}
								error={field.error}
							/>
						)}
					</Field>
				</Form>
			</BlueBoard>
		</>
	);
};

export default OrderPage;
