import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Payments } from "~/types/appwrite";

export const listPayments = async (options?: {
	orderId?: string;
	userId?: string;
	dateFrom?: string;
	dateTo?: string;
}) => {
	const queries = [Query.isNull("deletedAt")];
	if (options?.orderId) queries.push(Query.equal("orderId", options.orderId));
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.dateFrom)
		queries.push(Query.greaterThan("date", options.dateFrom));
	if (options?.dateTo) queries.push(Query.lessThan("date", options.dateTo));

	const res = await tables.listRows<Payments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYMENTS,
		queries,
	});

	return res;
};

export const getPayment = async (id: string) => {
	const res = await tables.getRow<Payments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYMENTS,
		rowId: id,
	});
	return res;
};

export const createPayment = async (payload: Payments) => {
	const res = await tables.createRow<Payments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYMENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayment = async (id: string, payload: Partial<Payments>) => {
	const res = await tables.updateRow<Payments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYMENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayment = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYMENTS,
		rowId: id,
	});
};
