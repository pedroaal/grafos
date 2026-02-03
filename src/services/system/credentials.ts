import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Credentials } from "~/types/appwrite";

/**
 * List credentials with optional pagination
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listCredentials = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		queries,
	});
	return res;
};

export const getCredential = async (id: string) => {
	const res = await tables.getRow<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: id,
	});
	return res;
};

export const createCredential = async (payload: Credentials) => {
	// Expectation: payload.password may be plaintext; Appwrite Function will hash it.
	const res = await tables.createRow<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCredential = async (
	id: string,
	payload: Partial<Credentials>,
) => {
	const res = await tables.updateRow<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCredential = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: id,
	});
};
