import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Inks } from "~/types/appwrite";

/**
 * List inks with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.search - Filter by color
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listInks = async (options?: {
	search?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	if (options?.search) queries.push(Query.equal("color", options.search));

	const res = await tables.listRows<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		queries,
	});

	return res;
};

export const getInk = async (id: string) => {
	const res = await tables.getRow<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: id,
	});
	return res;
};

export const createInk = async (tenantId: string, payload: Inks) => {
	const res = await tables.createRow<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateInk = async (id: string, payload: Partial<Inks>) => {
	const res = await tables.updateRow<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteInk = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: id,
	});
};
