import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listInvoices(options?: {
	companyId: string;
	clientId?: string;
	status?: "pending" | "paid";
	dateFrom?: string; // ISO date inclusive
	dateTo?: string; // ISO date inclusive
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.INVOICES);
	let docs = res.documents as Invoice[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.clientId)
		docs = docs.filter((d) => d.clientId === options.clientId);
	if (options?.status) docs = docs.filter((d) => d.status === options.status);
	if (options?.dateFrom)
		docs = docs.filter(
			(d) => new Date(d.issueDate) >= new Date(options.dateFrom),
		);
	if (options?.dateTo)
		docs = docs.filter(
			(d) => new Date(d.issueDate) <= new Date(options.dateTo),
		);

	return res;
}

export const getInvoice(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.INVOICES, id);
	return res as Invoice;
}

/**
 * Use server-side flow for assigning invoiceNumber.
 * This client function will simply attempt creation with provided payload.
 */
export const createInvoice(payload: Partial<Invoice>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.INVOICES,
		makeId(),
		payload,
	);
	return res as Invoice;
}

export const updateInvoice(id: string, payload: Partial<Invoice>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.INVOICES, id, payload);
	return res as Invoice;
}

export const deleteInvoice(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.INVOICES, id);
}
