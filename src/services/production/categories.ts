import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Categories } from "~/types/appwrite";

/**
 * List categories with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.search - Filter by name
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listCategories = async (options?: {
	search?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	if (options?.search) queries.push(Query.equal("name", options.search));

	const res = await tables.listRows<Categories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CATEGORIES,
		queries,
	});

	return res;
};

export const getCategory = async (id: string) => {
	const res = await tables.getRow<Categories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CATEGORIES,
		rowId: id,
	});
	return res;
};

export const createCategory = async (tenantId: string, payload: Categories) => {
	const res = await tables.createRow<Categories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CATEGORIES,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateCategory = async (
	id: string,
	payload: Partial<Categories>,
) => {
	const res = await tables.updateRow<Categories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CATEGORIES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCategory = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CATEGORIES,
		rowId: id,
	});
};
