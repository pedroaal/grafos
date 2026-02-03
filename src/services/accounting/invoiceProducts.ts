import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { InvoiceProducts } from "~/types/appwrite";

export const listInvoiceProducts = async (options: {
	invoiceId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.invoiceId) queries.push(Query.equal("invoiceId", options.invoiceId));

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
