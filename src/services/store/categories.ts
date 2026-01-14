import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProductCategories } from "~/types/appwrite";

export const listProductCategories = async (
	tenantId: string,
	options?: {
		parentId?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("tenantId", tenantId),
	];
	if (options?.parentId)
		queries.push(Query.equal("parentId", options.parentId));

	const res = await tables.listRows<ProductCategories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCT_CATEGORIES,
		queries,
	});

	return res;
};

export const getProductCategory = async (id: string) => {
	const res = await tables.getRow<ProductCategories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCT_CATEGORIES,
		rowId: id,
	});
	return res;
};

export const createProductCategory = async (payload: ProductCategories) => {
	const res = await tables.createRow<ProductCategories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCT_CATEGORIES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateProductCategory = async (
	id: string,
	payload: Partial<ProductCategories>,
) => {
	const res = await tables.updateRow<ProductCategories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCT_CATEGORIES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteProductCategory = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCT_CATEGORIES,
		rowId: id,
	});
};
