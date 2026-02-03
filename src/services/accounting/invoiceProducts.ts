import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { InvoiceProducts } from "~/types/appwrite";

export const listInvoiceProducts = async (options: { invoiceId?: string }) => {
	const queries = [Query.limit(50)];
	if (options?.invoiceId)
		queries.push(Query.equal("invoiceId", options.invoiceId));

	const res = await tables.listRows<InvoiceProducts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_PRODUCTS,
		queries,
	});
	return res;
};

export const getInvoiceProduct = async (id: string) => {
	const res = await tables.getRow<InvoiceProducts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_PRODUCTS,
		rowId: id,
	});
	return res;
};

export const createInvoiceProduct = async (payload: InvoiceProducts) => {
	const res = await tables.createRow<InvoiceProducts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_PRODUCTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateInvoiceProduct = async (
	id: string,
	payload: Partial<InvoiceProducts>,
) => {
	const res = await tables.updateRow<InvoiceProducts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_PRODUCTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteInvoiceProduct = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICE_PRODUCTS,
		rowId: id,
	});
};
