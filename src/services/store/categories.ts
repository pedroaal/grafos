import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProductCategories } from "~/types/appwrite";

/**
 * List product categories with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.parentId - Filter by parent ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listProductCategories = async (options?: {
	parentId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
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
