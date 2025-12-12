import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listInvoiceOrders(options?: {
	invoiceId?: string;
	orderId?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.INVOICE_ORDERS);
	let docs = res.documents as InvoiceOrder[];
	if (options?.invoiceId)
		docs = docs.filter((d) => d.invoiceId === options.invoiceId);
	if (options?.orderId)
		docs = docs.filter((d) => d.orderId === options.orderId);
	return res;
}

export const getInvoiceOrder(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.INVOICE_ORDERS, id);
	return res as InvoiceOrder;
}

export const createInvoiceOrder(payload: Partial<InvoiceOrder>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.INVOICE_ORDERS,
		makeId(),
		payload,
	);
	return res as InvoiceOrder;
}

export const updateInvoiceOrder(
	id: string,
	payload: Partial<InvoiceOrder>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.INVOICE_ORDERS,
		id,
		payload,
	);
	return res as InvoiceOrder;
}

export const deleteInvoiceOrder(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.INVOICE_ORDERS, id);
}
