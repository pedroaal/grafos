import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderProcesses } from "~/types/appwrite";

export const listOrderProcesses = async (options?: {
	orderId?: string;
	status?: boolean;
}) => {
	const queries = [Query.isNull("deletedAt")];
	if (options?.orderId) queries.push(Query.equal("orderId", options.orderId));
	if (options?.status !== undefined)
		queries.push(Query.equal("status", options.status));

	const res = await tables.listRows<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		queries,
	});
	return res;
};

export const getOrderProcess = async (id: string) => {
	const res = await tables.getRow<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: id,
	});
	return res;
};

export const createOrderProcess = async (payload: OrderProcesses) => {
	const res = await tables.createRow<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateOrderProcess = async (
	id: string,
	payload: Partial<OrderProcesses>,
) => {
	const res = await tables.updateRow<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteOrderProcess = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: id,
	});
};
