import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Products } from "~/types/appwrite";

export const listProducts = async (
	companyId: string,
	options?: {
		categoryId?: string;
		search?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("companyId", companyId),
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
