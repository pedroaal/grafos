import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Categories } from "~/types/appwrite";

export const listCategories = async (
	companyId: string,
	options?: {
		search?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("companyId", companyId),
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

export const createCategory = async (payload: Categories) => {
	const res = await tables.createRow<Categories>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CATEGORIES,
		rowId: makeId(),
		data: payload,
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
