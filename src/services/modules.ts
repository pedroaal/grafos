import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listModules(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.MODULES);
	let docs = res.documents as Module[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getModule(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.MODULES, id);
	return res as Module;
}

export const createModule(payload: Partial<Module>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.MODULES,
		makeId(),
		payload,
	);
	return res as Module;
}

export const updateModule(id: string, payload: Partial<Module>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.MODULES, id, payload);
	return res as Module;
}

export const deleteModule(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.MODULES, id);
}
