import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { InvoiceWorkOrders } from "~/types/appwrite";

export const listInvoiceOrders = async (options: {
	invoiceId?: string;
	orderId?: string;
}) => {
	const queries = [Query.limit(50)];
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
