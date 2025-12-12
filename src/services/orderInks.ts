import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listOrderInks(options?: {
	orderId?: string;
	inkId?: string;
	side?: boolean;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.ORDER_INKS);
	let docs = res.documents as OrderInk[];

	if (options?.orderId)
		docs = docs.filter((d) => d.orderId === options.orderId);
	if (options?.inkId) docs = docs.filter((d) => d.inkId === options.inkId);
	if (typeof options?.side === "boolean")
		docs = docs.filter((d) => d.side === options.side);

	return res;
}

export const getOrderInk(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.ORDER_INKS, id);
	return res as OrderInk;
}

export const createOrderInk(payload: Partial<OrderInk>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.ORDER_INKS,
		makeId(),
		payload,
	);
	return res as OrderInk;
}

export const updateOrderInk(id: string, payload: Partial<OrderInk>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.ORDER_INKS,
		id,
		payload,
	);
	return res as OrderInk;
}

export const deleteOrderInk(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.ORDER_INKS, id);
}
