import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listMaterials(options?: {
	companyId: string;
	categoryId?: string;
	search?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.MATERIALS);
	let docs = res.documents as Material[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.categoryId)
		docs = docs.filter((d) => d.categoryId === options.categoryId);
	if (options?.search) {
		const q = options.search.toLowerCase();
		docs = docs.filter((d) => (d.description || "").toLowerCase().includes(q));
	}

	return res;
}

export const getMaterial(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.MATERIALS, id);
	return res as Material;
}

export const createMaterial(payload: Partial<Material>) {
	// Validate numeric fields client-side optionally; Appwrite will enforce schema constraints server-side.
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.MATERIALS,
		makeId(),
		payload,
	);
	return res as Material;
}

export const updateMaterial(id: string, payload: Partial<Material>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.MATERIALS,
		id,
		payload,
	);
	return res as Material;
}

export const deleteMaterial(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.MATERIALS, id);
}
