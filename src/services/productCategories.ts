import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listProductCategories(options?: {
	companyId: string;
	parentId?: string | null;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PRODUCT_CATEGORIES);
	let docs = res.documents as ProductCategory[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.parentId !== undefined)
		docs = docs.filter((d) => (d.parentId ?? null) === options.parentId);

	// order by parent to group children (matches parentIdx ASC)
	docs = docs.sort((a, b) =>
		(a.parentId ?? "").localeCompare(b.parentId ?? ""),
	);

	return res;
}

export const getProductCategory(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PRODUCT_CATEGORIES, id);
	return res as ProductCategory;
}

export const createProductCategory(payload: Partial<ProductCategory>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PRODUCT_CATEGORIES,
		makeId(),
		payload,
	);
	return res as ProductCategory;
}

export const updateProductCategory(
	id: string,
	payload: Partial<ProductCategory>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PRODUCT_CATEGORIES,
		id,
		payload,
	);
	return res as ProductCategory;
}

export const deleteProductCategory(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PRODUCT_CATEGORIES, id);
}
