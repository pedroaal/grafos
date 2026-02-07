import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";

import { createAsync, useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, createSignal, For, on } from "solid-js";
import {
	boolean,
	number,
	object,
	optional,
	string,
	enum as vEnum,
} from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";

import { listBillingCompanies } from "~/services/accounting/billingCompanies";
import {
	createInvoiceOrder,
	deleteInvoiceOrder,
	listInvoiceOrders,
} from "~/services/accounting/invoiceOrders";
import {
	createInvoiceProduct,
	deleteInvoiceProduct,
	listInvoiceProducts,
	updateInvoiceProduct,
} from "~/services/accounting/invoiceProducts";
import {
	createInvoice,
	getInvoice,
	updateInvoice,
} from "~/services/accounting/invoices";
import { listTaxes } from "~/services/accounting/taxes";
import { listWithholdings } from "~/services/accounting/withholdings";
import { listOrders } from "~/services/production/orders";
import { listClients } from "~/services/sales/clients";
import {
	type InvoiceProducts,
	type Invoices,
	InvoicesPaymentType,
	InvoicesStatus,
} from "~/types/appwrite.d";

const InvoiceSchema = object({
	invoiceNumber: number(),
	billingCompanyId: string(),
	clientId: string(),
	issueDate: string(),
	dueDate: string(),
	type: boolean(),
	status: vEnum(InvoicesStatus),
	paymentDate: optional(string()),
	paymentType: vEnum(InvoicesPaymentType),
	subtotal: number(),
	discountPercentage: number(),
	discount: number(),
	tax: number(),
	taxExempt: number(),
	total: number(),
	withholdingId: string(),
	withholding: number(),
	sourceWithholdingId: string(),
	sourceWithholding: number(),
});

type InvoiceForm = Omit<Invoices, keyof Models.Row | "userId">;

const INVOICE_STATUS_OPTIONS = [
	{ key: InvoicesStatus.PENDING, label: "Pendiente" },
	{ key: InvoicesStatus.PAID, label: "Pagado" },
];

const PAYMENT_TYPE_OPTIONS = [
	{ key: InvoicesPaymentType.CASH, label: "Efectivo" },
	{ key: InvoicesPaymentType.TRANSFER, label: "Transferencia" },
	{ key: InvoicesPaymentType.EXCHANGE, label: "Permuta" },
	{ key: InvoicesPaymentType.CARD, label: "Tarjeta" },
];

interface InvoiceProductItem {
	id?: string;
	quantity: number;
	detail: string;
	taxId: string;
	unitPrice: number;
	subtotal: number;
}

interface InvoiceOrderItem {
	id?: string;
	orderId: string;
}

const InvoicePage = () => {
	const params = useParams();
	const nav = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [invoiceProducts, setInvoiceProducts] = createSignal<
		InvoiceProductItem[]
	>([]);
	const [invoiceOrders, setInvoiceOrders] = createSignal<InvoiceOrderItem[]>(
		[],
	);

	const [form, { Form, Field }] = createForm<InvoiceForm>({
		validate: valiForm(InvoiceSchema),
		initialValues: {
			invoiceNumber: 1,
			billingCompanyId: "" as any,
			clientId: "" as any,
			issueDate: new Date().toISOString().split("T")[0],
			dueDate: new Date().toISOString().split("T")[0],
			type: true,
			status: InvoicesStatus.PENDING,
			paymentDate: null,
			paymentType: InvoicesPaymentType.CASH,
			subtotal: 0,
			discountPercentage: 0,
			discount: 0,
			tax: 0,
			taxExempt: 0,
			total: 0,
			withholdingId: "" as any,
			withholding: 0,
			sourceWithholdingId: "" as any,
			sourceWithholding: 0,
		},
	});

	const [invoice] = createResource(() => params.id ?? "", getInvoice);

	const [existingProducts] = createResource(
		() => (params.id ? { invoiceId: params.id } : undefined),
		listInvoiceProducts,
	);

	const [existingOrders] = createResource(
		() => (params.id ? { invoiceId: params.id } : undefined),
		listInvoiceOrders,
	);

	const [billingCompaniesList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listBillingCompanies,
	);

	const [clientsList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listClients,
	);

	const [withholdingsList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listWithholdings,
	);

	const [taxesList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listTaxes,
	);

	const [ordersList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listOrders,
	);

	createEffect(
		on(
			() => invoice(),
			(invoiceData) => {
				if (!invoiceData || !isEdit()) return;

				setValues(form, {
					invoiceNumber: invoiceData.invoiceNumber ?? 1,
					billingCompanyId: invoiceData.billingCompanyId.$id as any,
					clientId: invoiceData.clientId.$id as any,
					issueDate: invoiceData.issueDate || "",
					dueDate: invoiceData.dueDate || "",
					type: invoiceData.type ?? true,
					status: invoiceData.status || InvoicesStatus.PENDING,
					paymentDate: invoiceData.paymentDate,
					paymentType: invoiceData.paymentType || InvoicesPaymentType.CASH,
					subtotal: invoiceData.subtotal ?? 0,
					discountPercentage: invoiceData.discountPercentage ?? 0,
					discount: invoiceData.discount ?? 0,
					tax: invoiceData.tax ?? 0,
					taxExempt: invoiceData.taxExempt ?? 0,
					total: invoiceData.total ?? 0,
					withholdingId: invoiceData.withholdingId.$id as any,
					withholding: invoiceData.withholding ?? 0,
					sourceWithholdingId: invoiceData.sourceWithholdingId.$id as any,
					sourceWithholding: invoiceData.sourceWithholding ?? 0,
				});
			},
		),
	);

	createEffect(
		on(
			() => existingProducts(),
			(products) => {
				if (!products?.rows || !isEdit()) return;
				setInvoiceProducts(
					products.rows.map((p) => ({
						id: p.$id,
						quantity: p.quantity,
						detail: p.detail,
						taxId: p.taxId.$id,
						unitPrice: p.unitPrice,
						subtotal: p.subtotal,
					})),
				);
			},
		),
	);

	createEffect(
		on(
			() => existingOrders(),
			(orders) => {
				if (!orders?.rows || !isEdit()) return;
				setInvoiceOrders(
					orders.rows.map((o) => ({
						id: o.$id,
						orderId: o.orderId.$id,
					})),
				);
			},
		),
	);

	const addProduct = () => {
		setInvoiceProducts([
			...invoiceProducts(),
			{
				quantity: 1,
				detail: "",
				taxId: "",
				unitPrice: 0,
				subtotal: 0,
			},
		]);
	};

	const removeProduct = async (index: number) => {
		const product = invoiceProducts()[index];
		if (product.id) {
			try {
				await deleteInvoiceProduct(product.id);
			} catch (error: any) {
				addAlert({
					type: "error",
					message: error.message || "Error al eliminar producto",
				});
				return;
			}
		}
		setInvoiceProducts(invoiceProducts().filter((_, i) => i !== index));
	};

	const updateProduct = (index: number, field: string, value: any) => {
		const products = [...invoiceProducts()];
		products[index] = { ...products[index], [field]: value };

		// Calculate subtotal
		if (field === "quantity" || field === "unitPrice") {
			products[index].subtotal =
				products[index].quantity * products[index].unitPrice;
		}

		setInvoiceProducts(products);
	};

	const addOrder = () => {
		setInvoiceOrders([
			...invoiceOrders(),
			{
				orderId: "",
			},
		]);
	};

	const removeOrder = async (index: number) => {
		const order = invoiceOrders()[index];
		if (order.id) {
			try {
				await deleteInvoiceOrder(order.id);
			} catch (error: any) {
				addAlert({
					type: "error",
					message: error.message || "Error al eliminar orden",
				});
				return;
			}
		}
		setInvoiceOrders(invoiceOrders().filter((_, i) => i !== index));
	};

	const updateOrder = (index: number, orderId: string) => {
		const orders = [...invoiceOrders()];
		orders[index] = { ...orders[index], orderId };
		setInvoiceOrders(orders);
	};

	const handleSubmit = async (formValues: InvoiceForm) => {
		const loaderId = addLoader();
		try {
			const payload = {
				...formValues,
				userId: authStore?.user!.$id,
			} as Invoices;

			let invoiceId: string;

			if (isEdit()) {
				await updateInvoice(params.id!, payload);
				invoiceId = params.id!;
				addAlert({
					type: "success",
					message: "Factura actualizada con éxito",
				});
			} else {
				const newInvoice = await createInvoice(authStore?.tenantId!, payload);
				invoiceId = newInvoice.$id;
				addAlert({
					type: "success",
					message: "Factura creada con éxito",
				});
			}

			// Save invoice products
			for (const product of invoiceProducts()) {
				const productPayload = {
					invoiceId,
					quantity: product.quantity,
					detail: product.detail,
					taxId: product.taxId,
					unitPrice: product.unitPrice,
					subtotal: product.subtotal,
				} as InvoiceProducts;

				if (product.id) {
					// Update existing product
					await updateInvoiceProduct(product.id, productPayload);
				} else {
					await createInvoiceProduct(authStore?.tenantId!, productPayload);
				}
			}

			// Save invoice orders
			for (const order of invoiceOrders()) {
				if (!order.id && order.orderId) {
					await createInvoiceOrder(authStore?.tenantId!, {
						invoiceId,
						orderId: order.orderId,
					} as any);
				}
			}

			nav(Routes.invoices);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar factura",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Factura - Grafos</Title>
			<Breadcrumb
				links={[
					{ label: "Contabilidad" },
					{ label: "Facturas", route: Routes.invoices },
					{
						label: invoice() ? `Factura #${invoice()!.invoiceNumber}` : "Nueva",
					},
				]}
			/>
			<BlueBoard
				title="Gestionar Factura"
				actions={[
					{
						label: "Guardar",
						onClick: () => submit(form),
					},
				]}
			>
				<Form onSubmit={handleSubmit}>
					{/* Basic Info */}
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
						<div class="md:col-span-3">
							<Field name="invoiceNumber" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Número de Factura"
										value={field.value ?? 1}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="issueDate">
								{(field, props) => (
									<Input
										{...props}
										type="date"
										label="Fecha Emisión"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="dueDate">
								{(field, props) => (
									<Input
										{...props}
										type="date"
										label="Fecha Vencimiento"
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="status">
								{(field, props) => (
									<Select
										{...props}
										label="Estado"
										options={INVOICE_STATUS_OPTIONS}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="billingCompanyId">
								{(field, props) => (
									<Select
										{...props}
										label="Empresa de Facturación"
										options={
											billingCompaniesList()?.rows.map((company) => ({
												key: company.$id,
												label: company.businessName,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="clientId">
								{(field, props) => (
									<Select
										{...props}
										label="Cliente"
										options={
											clientsList()?.rows.map((client) => ({
												key: client.$id,
												label: `${client.contactId.firstName} ${client.contactId.lastName}`,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="paymentType">
								{(field, props) => (
									<Select
										{...props}
										label="Tipo de Pago"
										options={PAYMENT_TYPE_OPTIONS}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="paymentDate">
								{(field, props) => (
									<Input
										{...props}
										type="date"
										label="Fecha de Pago"
										value={field.value || ""}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="type" type="boolean">
								{(field, props) => (
									<Select
										{...props}
										label="Tipo de Factura"
										options={[
											{ key: "true", label: "Venta" },
											{ key: "false", label: "Compra" },
										]}
										value={field.value ? "true" : "false"}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>
					</div>

					{/* Financial Fields */}
					<div class="divider">Información Financiera</div>
					<div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
						<div class="md:col-span-3">
							<Field name="subtotal" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Subtotal"
										value={field.value ?? 0}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="discountPercentage" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="% Descuento"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="discount" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Descuento"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="tax" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Impuesto"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="taxExempt" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Exento de Impuesto"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="total" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Total"
										value={field.value ?? 0}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="withholdingId">
								{(field, props) => (
									<Select
										{...props}
										label="Retención"
										options={
											withholdingsList()?.rows.map((w) => ({
												key: w.$id,
												label: w.description,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-3">
							<Field name="withholding" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Valor Retención"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="sourceWithholdingId">
								{(field, props) => (
									<Select
										{...props}
										label="Retención en Fuente"
										options={
											withholdingsList()?.rows.map((w) => ({
												key: w.$id,
												label: w.description,
											})) || []
										}
										value={field.value}
										error={field.error}
										required
									/>
								)}
							</Field>
						</div>

						<div class="md:col-span-6">
							<Field name="sourceWithholding" type="number">
								{(field, props) => (
									<Input
										{...props}
										type="number"
										label="Valor Retención Fuente"
										value={field.value ?? 0}
										error={field.error}
									/>
								)}
							</Field>
						</div>
					</div>
				</Form>

				{/* Invoice Products */}
				<div class="divider">Productos de Factura</div>
				<div class="mb-4">
					<button
						type="button"
						class="btn btn-sm btn-primary"
						onClick={addProduct}
					>
						Agregar Producto
					</button>
				</div>
				<div class="overflow-x-auto mb-6">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Cantidad</th>
								<th>Detalle</th>
								<th>Impuesto</th>
								<th>Precio Unitario</th>
								<th>Subtotal</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							<For each={invoiceProducts()}>
								{(product, index) => (
									<tr>
										<td>
											<input
												type="number"
												class="input input-sm input-bordered w-20"
												value={product.quantity}
												onChange={(e) =>
													updateProduct(
														index(),
														"quantity",
														Number(e.currentTarget.value) || 0,
													)
												}
											/>
										</td>
										<td>
											<input
												type="text"
												class="input input-sm input-bordered w-full"
												value={product.detail}
												onChange={(e) =>
													updateProduct(
														index(),
														"detail",
														e.currentTarget.value,
													)
												}
											/>
										</td>
										<td>
											<select
												class="select select-sm select-bordered"
												value={product.taxId}
												onChange={(e) =>
													updateProduct(index(), "taxId", e.currentTarget.value)
												}
											>
												<option value="">Seleccione...</option>
												<For each={taxesList()?.rows || []}>
													{(tax) => (
														<option value={tax.$id}>{tax.percentage}%</option>
													)}
												</For>
											</select>
										</td>
										<td>
											<input
												type="number"
												class="input input-sm input-bordered w-28"
												value={product.unitPrice}
												onChange={(e) =>
													updateProduct(
														index(),
														"unitPrice",
														Number(e.currentTarget.value) || 0,
													)
												}
											/>
										</td>
										<td>${product.subtotal.toFixed(2)}</td>
										<td>
											<button
												type="button"
												class="btn btn-sm btn-error"
												onClick={() => removeProduct(index())}
											>
												Eliminar
											</button>
										</td>
									</tr>
								)}
							</For>
						</tbody>
					</table>
				</div>

				{/* Invoice Orders */}
				<div class="divider">Órdenes de Trabajo</div>
				<div class="mb-4">
					<button
						type="button"
						class="btn btn-sm btn-primary"
						onClick={addOrder}
					>
						Agregar Orden
					</button>
				</div>
				<div class="overflow-x-auto mb-6">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Orden de Trabajo</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							<For each={invoiceOrders()}>
								{(order, index) => (
									<tr>
										<td>
											<select
												class="select select-sm select-bordered w-full"
												value={order.orderId}
												onChange={(e) =>
													updateOrder(index(), e.currentTarget.value)
												}
											>
												<option value="">Seleccione orden...</option>
												<For each={ordersList()?.rows || []}>
													{(o) => (
														<option value={o.$id}>
															Orden #{o.orderNumber} - {o.name}
														</option>
													)}
												</For>
											</select>
										</td>
										<td>
											<button
												type="button"
												class="btn btn-sm btn-error"
												onClick={() => removeOrder(index())}
											>
												Eliminar
											</button>
										</td>
									</tr>
								)}
							</For>
						</tbody>
					</table>
				</div>
			</BlueBoard>
		</>
	);
};

export default InvoicePage;
