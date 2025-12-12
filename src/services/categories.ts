import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listCategories(options?: {
	companyId: string;
	search?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CATEGORIES);
	let docs = res.documents as Category[];

	if (options?.companyId)
		docs = docs.filter((c) => c.companyId === options.companyId);
	if (options?.search) {
		const q = options.search.toLowerCase();
		docs = docs.filter((c) => (c.name || "").toLowerCase().includes(q));
	}

	return res;
}

export const getCategory(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CATEGORIES, id);
	return res as Category;
}

export const createCategory(payload: Partial<Category>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CATEGORIES,
		makeId(),
		payload,
	);
	return res as Category;
}

export const updateCategory(id: string, payload: Partial<Category>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.CATEGORIES,
		id,
		payload,
	);
	return res as Category;
}

export const deleteCategory(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CATEGORIES, id);
}
