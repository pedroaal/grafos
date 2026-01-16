import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderPayments } from "~/types/appwrite";

export const listOrderPayments = async (options?: {
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

	const res = await tables.listRows<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		queries,
	});

	return res;
};

export const getPayment = async (id: string) => {
	const res = await tables.getRow<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: id,
	});
	return res;
};

export const createPayment = async (payload: OrderPayments) => {
	const res = await tables.createRow<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayment = async (id: string, payload: Partial<OrderPayments>) => {
	const res = await tables.updateRow<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayment = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: id,
	});
};
