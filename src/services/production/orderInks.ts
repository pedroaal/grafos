import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderInks } from "~/types/appwrite";

export const listOrderInks = async (options?: {
	orderId?: string;
	inkId?: string;
	side?: boolean;
}) => {
	const queries = [Query.isNull("deletedAt")];
	if (options?.orderId) queries.push(Query.equal("orderId", options.orderId));
	if (options?.inkId) queries.push(Query.equal("inkId", options.inkId));
	if (options?.side !== undefined)
		queries.push(Query.equal("side", options.side));

	const res = await tables.listRows<OrderInks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_INKS,
		queries,
	});
	return res;
};

export const getOrderInk = async (id: string) => {
	const res = await tables.getRow<OrderInks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_INKS,
		rowId: id,
	});
	return res;
};

export const createOrderInk = async (payload: OrderInks) => {
	const res = await tables.createRow<OrderInks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_INKS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateOrderInk = async (
	id: string,
	payload: Partial<OrderInks>,
) => {
	const res = await tables.updateRow<OrderInks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_INKS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteOrderInk = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_INKS,
		rowId: id,
	});
};
