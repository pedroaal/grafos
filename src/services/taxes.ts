import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listTaxes(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.TAXES);
	let docs = res.documents as Tax[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getTax(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.TAXES, id);
	return res as Tax;
}

export const createTax(payload: Partial<Tax>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.TAXES,
		makeId(),
		payload,
	);
	return res as Tax;
}

export const updateTax(id: string, payload: Partial<Tax>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.TAXES, id, payload);
	return res as Tax;
}

export const deleteTax(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.TAXES, id);
}
