import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listInks(options?: {
	companyId: string;
	search?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.INKS);
	let docs = res.documents as Ink[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.search) {
		const q = options.search.toLowerCase();
		docs = docs.filter((d) => (d.color || "").toLowerCase().includes(q));
	}

	return res;
}

export const getInk(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.INKS, id);
	return res as Ink;
}

export const createInk(payload: Partial<Ink>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.INKS,
		makeId(),
		payload,
	);
	return res as Ink;
}

export const updateInk(id: string, payload: Partial<Ink>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.INKS, id, payload);
	return res as Ink;
}

export const deleteInk(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.INKS, id);
}
