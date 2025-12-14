import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Invoices } from "~/types/appwrite";

export const listInvoices = async (
	companyId: string,
	options?: {
		clientId?: string;
		status?: "pending" | "paid";
		dateFrom?: string;
		dateTo?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("companyId", companyId),
	];
	if (options?.clientId)
		queries.push(Query.equal("clientId", options.clientId));
	if (options?.status) queries.push(Query.equal("status", options.status));
	if (options?.dateFrom)
		queries.push(Query.greaterThan("$createdAt", options.dateFrom));
	if (options?.dateTo)
		queries.push(Query.lessThan("$createdAt", options.dateTo));

	const res = await tables.listRows<Invoices>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICES,
		queries,
	});

	return res;
};

export const getInvoice = async (id: string) => {
	const res = await tables.getRow<Invoices>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICES,
		rowId: id,
	});
	return res;
};

export const createInvoice = async (payload: Invoices) => {
	const res = await tables.createRow<Invoices>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateInvoice = async (id: string, payload: Partial<Invoices>) => {
	const res = await tables.updateRow<Invoices>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteInvoice = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.INVOICES,
		rowId: id,
	});
};
