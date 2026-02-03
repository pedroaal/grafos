import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Withholdings } from "~/types/appwrite";

/**
 * List withholdings with optional pagination
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listWithholdings = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Withholdings>({
		databaseId: DATABASE_ID,
		tableId: TABLES.WITHHOLDINGS,
		queries,
	});
	return res;
};

export const getWithholding = async (id: string) => {
	const res = await tables.getRow<Withholdings>({
		databaseId: DATABASE_ID,
		tableId: TABLES.WITHHOLDINGS,
		rowId: id,
	});
	return res;
};

export const createWithholding = async (payload: Withholdings) => {
	const res = await tables.createRow<Withholdings>({
		databaseId: DATABASE_ID,
		tableId: TABLES.WITHHOLDINGS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateWithholding = async (
	id: string,
	payload: Partial<Withholdings>,
) => {
	const res = await tables.updateRow<Withholdings>({
		databaseId: DATABASE_ID,
		tableId: TABLES.WITHHOLDINGS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteWithholding = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.WITHHOLDINGS,
		rowId: id,
	});
};
