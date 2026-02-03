import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { UserBook } from "~/types/appwrite";

/**
 * List user books with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.userId - Filter by user ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listUserBooks = async (options?: {
	userId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));

	const res = await tables.listRows<UserBook>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_BOOK,
		queries,
	});
	return res;
};

export const getUserBook = async (id: string) => {
	const res = await tables.getRow<UserBook>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_BOOK,
		rowId: id,
	});
	return res;
};

export const createUserBook = async (payload: UserBook) => {
	const res = await tables.createRow<UserBook>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_BOOK,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateUserBook = async (
	id: string,
	payload: Partial<UserBook>,
) => {
	const res = await tables.updateRow<UserBook>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_BOOK,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteUserBook = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_BOOK,
		rowId: id,
	});
};
