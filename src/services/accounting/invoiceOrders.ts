import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { InvoiceWorkOrders } from "~/types/appwrite";

/**
 * List invoice orders with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.invoiceId - Filter by invoice ID
 * @param options.orderId - Filter by order ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listInvoiceOrders = async (options?: {
	invoiceId?: string;
	orderId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.invoiceId)
		queries.push(Query.equal("invoiceId", options.invoiceId));
	if (options?.orderId) queries.push(Query.equal("orderId", options.orderId));

	const res = await tables.listRows<InvoiceWorkOrders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_ORDERS,
		queries,
	});
	return res;
};

export const getInvoiceOrder = async (id: string) => {
	const res = await tables.getRow<InvoiceWorkOrders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_ORDERS,
		rowId: id,
	});
	return res;
};

export const createInvoiceOrder = async (payload: InvoiceWorkOrders) => {
	const res = await tables.createRow<InvoiceWorkOrders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_ORDERS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateInvoiceOrder = async (
	id: string,
	payload: Partial<InvoiceWorkOrders>,
) => {
	const res = await tables.updateRow<InvoiceWorkOrders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_ORDERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteInvoiceOrder = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_ORDERS,
		rowId: id,
	});
};
