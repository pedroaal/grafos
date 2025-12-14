import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Orders } from "~/types/appwrite";

export const listOrders = async (
	companyId: string,
	options?: {
		userId?: string;
		clientId?: string;
		status?: string;
		dateFrom?: string;
		dateTo?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("companyId", companyId),
	];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.clientId)
		queries.push(Query.equal("clientId", options.clientId));
	if (options?.status) queries.push(Query.equal("status", options.status));
	if (options?.dateFrom)
		queries.push(Query.greaterThan("startDate", options.dateFrom));
	if (options?.dateTo) queries.push(Query.lessThan("endDate", options.dateTo));

	const res = await tables.listRows<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		queries,
	});

	return res;
};

export const getOrder = async (id: string) => {
	const res = await tables.getRow<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: id,
	});
	return res;
};

export const createOrder = async (payload: Orders) => {
	const res = await tables.createRow<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateOrder = async (id: string, payload: Partial<Orders>) => {
	const res = await tables.updateRow<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteOrder = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: id,
	});
};
