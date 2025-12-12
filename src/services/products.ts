import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listProducts(options?: {
	companyId: string;
	categoryId?: string;
	search?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PRODUCTS);
	let docs = res.documents as Product[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.categoryId)
		docs = docs.filter((d) => d.categoryId === options.categoryId);
	if (options?.search) {
		const q = options.search.toLowerCase();
		docs = docs.filter(
			(d) =>
				(d.name || "").toLowerCase().includes(q) ||
				(d.description || "").toLowerCase().includes(q),
		);
	}

	return res;
}

export const getProduct(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PRODUCTS, id);
	return res as Product;
}

export const createProduct(payload: Partial<Product>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PRODUCTS,
		makeId(),
		payload,
	);
	return res as Product;
}

export const updateProduct(id: string, payload: Partial<Product>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.PRODUCTS, id, payload);
	return res as Product;
}

export const deleteProduct(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PRODUCTS, id);
}
