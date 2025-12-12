import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listWithholdings(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.WITHHOLDINGS);
	let docs = res.documents as Withholding[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getWithholding(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.WITHHOLDINGS, id);
	return res as Withholding;
}

export const createWithholding(payload: Partial<Withholding>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.WITHHOLDINGS,
		makeId(),
		payload,
	);
	return res as Withholding;
}

export const updateWithholding(
	id: string,
	payload: Partial<Withholding>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.WITHHOLDINGS,
		id,
		payload,
	);
	return res as Withholding;
}

export const deleteWithholding(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.WITHHOLDINGS, id);
}
