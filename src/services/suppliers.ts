import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listSuppliers(options?: {
	companyId: string;
	search?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.SUPPLIERS);
	let docs = res.documents as Supplier[];

	if (options?.companyId)
		docs = docs.filter((s) => s.companyId === options.companyId);
	if (options?.search) {
		const q = options.search.toLowerCase();
		docs = docs.filter((s) => (s.name || "").toLowerCase().includes(q));
	}

	return res;
}

export const getSupplier(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.SUPPLIERS, id);
	return res as Supplier;
}

export const createSupplier(payload: Partial<Supplier>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.SUPPLIERS,
		makeId(),
		payload,
	);
	return res as Supplier;
}

export const updateSupplier(id: string, payload: Partial<Supplier>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.SUPPLIERS,
		id,
		payload,
	);
	return res as Supplier;
}

export const deleteSupplier(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.SUPPLIERS, id);
}
