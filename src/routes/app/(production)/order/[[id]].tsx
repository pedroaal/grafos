import { createForm, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createSignal } from "solid-js";
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
import DashboardLayout from "~/components/layout/Dashboard";
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
import type { Orders } from "~/types/appwrite";

enum OrdersStatus {
	PENDING = "pending",
	PAID = "paid",
	OTHER = "other",
	CANCELED = "canceled",
}

const OrderSchema = object({
	number: number(),
	// userId: Users,
	clientId: string(),
	startDate: string(),
	endDate: string(),
	collectionDate: nullable(string()),
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
	materialTotal: number(),
	orderTotal: number(),
	paymentAmount: number(),
	balance: number(),
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
};

const OrderPage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<OrderForm>({
		validate: valiForm(OrderSchema),
		initialValues: ordersDefault,
	});

	// Repeated sections
	const [materials, setMaterials] = createSignal<MaterialForm[]>([]);
	const [processes, setProcesses] = createSignal<ProcessForm[]>([]);
	const [payments, setPayments] = createSignal<PaymentForm[]>([]);

	const processesTotal = () =>
		processes().reduce((sum, item) => sum + (Number(item.total) || 0), 0);
	const paymentsTotal = () =>
		payments().reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
	const balance = () => processesTotal() - paymentsTotal();

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
							onClick: () => console.log("Imprimir orden"),
							label: "Imprimir",
							disabled: !isEdit(),
						},
						{
							onClick: () => console.log("Duplicar orden"),
							label: "Duplicar",
							disabled: !isEdit(),
						},
						{
							form: "order-form",
							label: "Guardar",
						},
					]}
				>
					<Form id="order-form" onSubmit={handleSubmit}>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
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
							<div class="md:col-span-3">
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
							<div class="md:col-span-3">
								<Field name="status">
									{(field, props) => (
										<Select
											{...props}
											options={[]}
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
											options={[]}
											label="Cliente"
											value={field.value}
											error={field.error}
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
									value=""
									readOnly
								/>
							</div>

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
							<div class="md:col-span-2">
								<Field name="quotedPrice" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Cotizado $"
											step="0.0001"
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
