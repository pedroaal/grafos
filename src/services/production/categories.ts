import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Categories } from "~/types/appwrite";

export const listCategories = async (options?: {
	search?: string;
	page?: number;
	perPage?: number;
}) => {
	const queries = [];

	if (options?.search) queries.push(Query.equal("name", options.search));

	// Add pagination
	if (options?.page && options?.perPage) {
		const offset = (options.page - 1) * options.perPage;
		queries.push(Query.limit(options.perPage));
		queries.push(Query.offset(offset));
	}

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
