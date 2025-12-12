import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listPayments(options?: {
	orderId?: string;
	userId?: string;
	dateFrom?: string;
	dateTo?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PAYMENTS);
	let docs = res.documents as Payment[];

	if (options?.orderId)
		docs = docs.filter((d) => d.orderId === options.orderId);
	if (options?.userId) docs = docs.filter((d) => d.userId === options.userId);
	if (options?.dateFrom)
		docs = docs.filter((d) => new Date(d.date) >= new Date(options.dateFrom));
	if (options?.dateTo)
		docs = docs.filter((d) => new Date(d.date) <= new Date(options.dateTo));

	return res;
}

export const getPayment(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PAYMENTS, id);
	return res as Payment;
}

export const createPayment(payload: Partial<Payment>) {
	// Server-side validation recommended (amount > 0, order exists, permission checks)
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PAYMENTS,
		makeId(),
		payload,
	);
	return res as Payment;
}

export const updatePayment(id: string, payload: Partial<Payment>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.PAYMENTS, id, payload);
	return res as Payment;
}

export const deletePayment(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PAYMENTS, id);
}
