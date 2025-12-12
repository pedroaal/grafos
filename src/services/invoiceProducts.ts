import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listInvoiceProducts(invoiceId?: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.INVOICE_PRODUCTS);
	let docs = res.documents as InvoiceProduct[];
	if (invoiceId) docs = docs.filter((d) => d.invoiceId === invoiceId);
	return res;
}

export const getInvoiceProduct(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.INVOICE_PRODUCTS, id);
	return res as InvoiceProduct;
}

/**
 * Use server-side flows to create invoice products (recompute invoice totals atomically).
 * This function remains here for completeness but prefer server-side control.
 */
export const createInvoiceProduct(payload: Partial<InvoiceProduct>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.INVOICE_PRODUCTS,
		makeId(),
		payload,
	);
	return res as InvoiceProduct;
}

export const updateInvoiceProduct(
	id: string,
	payload: Partial<InvoiceProduct>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.INVOICE_PRODUCTS,
		id,
		payload,
	);
	return res as InvoiceProduct;
}

export const deleteInvoiceProduct(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.INVOICE_PRODUCTS, id);
}
