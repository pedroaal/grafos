import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listOrders(options?: {
	companyId: string;
	userId?: string;
	clientId?: string;
	status?: string;
	dateFrom?: string; // ISO date string (inclusive)
	dateTo?: string; // ISO date string (inclusive)
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.ORDERS);
	let docs = res.documents as Order[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.userId) docs = docs.filter((d) => d.userId === options.userId);
	if (options?.clientId)
		docs = docs.filter((d) => d.clientId === options.clientId);
	if (options?.status) docs = docs.filter((d) => d.status === options.status);
	if (options?.dateFrom)
		docs = docs.filter(
			(d) => new Date(d.startDate) >= new Date(options.dateFrom),
		);
	if (options?.dateTo)
		docs = docs.filter((d) => new Date(d.endDate) <= new Date(options.dateTo));

	return res;
}

export const getOrder(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.ORDERS, id);
	return res as Order;
}

export const createOrder(payload: Partial<Order>) {
	// Note: orderNumber may need server-side sequencing; consider creating via server API to guarantee uniqueness.
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.ORDERS,
		makeId(),
		payload,
	);
	return res as Order;
}

export const updateOrder(id: string, payload: Partial<Order>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.ORDERS, id, payload);
	return res as Order;
}

export const deleteOrder(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.ORDERS, id);
}
