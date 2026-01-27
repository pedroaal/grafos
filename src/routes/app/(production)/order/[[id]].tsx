import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import dayjs from "dayjs";
import { createEffect, createResource, createSignal, on } from "solid-js";
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
import Select from "~/components/core/Select";
import DashboardLayout from "~/components/layouts/Dashboard";
import MaterialsSection, {
	type MaterialForm,
} from "~/components/production/MaterialsSection";
import PaymentsSection, {
	type PaymentForm,
} from "~/components/production/PaymentsSection";
import ProcessesSection, {
	type ProcessForm,
} from "~/components/production/ProcessesSection";

import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
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
	getOrder,
	getOrderNumber,
	updateOrder,
} from "~/services/production/orders";
import { listClients } from "~/services/sales/clients";
import type { Contacts, Orders } from "~/types/appwrite";

enum OrdersStatus {
	PENDING = "pending",
	PAID = "paid",
	OTHER = "other",
	CANCELED = "canceled",
}

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
	const navigate = useNavigate();
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

	const [orderNumber] = createResource(getOrderNumber);
	const [order] = createResource(params.id, getOrder);
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

	const [materials, setMaterials] = createSignal<MaterialForm[]>([]);
	const [processes, setProcesses] = createSignal<ProcessForm[]>([]);
	const [payments, setPayments] = createSignal<PaymentForm[]>([]);

	const processesTotal = () =>
		processes().reduce((sum, item) => sum + (Number(item.total) || 0), 0);
	const paymentsTotal = () =>
		payments().reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
	const balance = () => processesTotal() - paymentsTotal();

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
			},
		),
	);

	createEffect(
		on(
			() => orderMaterials(),
			(orderMaterial) => {
				if (!orderMaterial || !isEdit()) return;
				const data = orderMaterial.rows.map((item) => ({
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
				const data = orderProcesses.rows.map((item) => ({
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
				const data = orderPayments.rows.map((item) => ({
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
			const tenantId = authStore.tenantId;
			if (!tenantId) throw new Error("No hay sesión de tenant");

			const userId = authStore.user?.$id;
			if (!userId) throw new Error("No hay sesión de usuario");

			// Prepare order payload
			const orderPayload = {
				...formValues,
				userId: userId,
				collectionDate:
					formValues.status === OrdersStatus.PAID
						? dayjs().format("YYYY-MM-DD")
						: undefined,
				materialTotal: processesTotal(),
				orderTotal: processesTotal(),
				paymentAmount: paymentsTotal(),
				balance: balance(),
			};

			let orderId = isEdit() ? params.id! : "";
			if (isEdit() && params.id) {
				await updateOrder(params.id, orderPayload);
			} else {
				const createdOrder = await createOrder(tenantId, orderPayload);
				orderId = createdOrder.$id;
			}

			await Promise.all([
				syncOrderMaterials(orderId, materials()),
				syncOrderProcesses(orderId, processes()),
				syncOrderPayments(orderId, payments()),
			]);

			addAlert({ type: "success", message: "Orden guardada correctamente" });
			navigate(Routes.orders);
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
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Produccion" },
						{ label: "Ordenes", route: Routes.orders },
						{ label: "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Orden"
					links={[
						{
							href: Routes.order,
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
							onClick: () => {
								// TODO: Implement duplicate functionality
							},
							label: "Duplicar",
							// disabled: !isEdit(),
						},
						{
							onClick: () => submit(form),
							label: "Guardar",
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
							<div class="md:col-span-5"></div>
							<div class="md:col-span-2">
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
							<div class="md:col-span-4"></div>
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
							<div class="md:col-span-4"></div>

							<div class="md:col-span-6">
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

							<div class="md:col-span-6">
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
							<div class="md:col-span-2">
								<Field name="cutHeight" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Corte A"
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
						</div>

						<MaterialsSection state={materials} setState={setMaterials} />

						<ProcessesSection state={processes} setState={setProcesses} />

						<PaymentsSection
							state={payments}
							setState={setPayments}
							balance={balance}
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
			</DashboardLayout>
		</>
	);
};

export default OrderPage;
