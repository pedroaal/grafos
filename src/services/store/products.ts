import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Products } from "~/types/appwrite";

/**
 * List products with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.categoryId - Filter by category ID
 * @param options.search - Filter by name
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listProducts = async (options?: {
	categoryId?: string;
	search?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.categoryId)
		queries.push(Query.equal("categoryId", options.categoryId));
	if (options?.search) queries.push(Query.equal("name", options.search));

	const res = await tables.listRows<Products>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTS,
		queries,
	});

	return res;
};

export const getProduct = async (id: string) => {
	const res = await tables.getRow<Products>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTS,
		rowId: id,
	});
	return res;
};

export const createProduct = async (payload: Products) => {
	const res = await tables.createRow<Products>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateProduct = async (id: string, payload: Partial<Products>) => {
	const res = await tables.updateRow<Products>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteProduct = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTS,
		rowId: id,
	});
};
