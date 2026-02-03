import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { BookReferences } from "~/types/appwrite";

/**
 * List book references with optional pagination
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listBookReferences = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<BookReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_REFERENCES,
		queries,
	});
	return res;
};

export const getBookReference = async (id: string) => {
	const res = await tables.getRow<BookReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_REFERENCES,
		rowId: id,
	});
	return res;
};

export const createBookReference = async (payload: BookReferences) => {
	const res = await tables.createRow<BookReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_REFERENCES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateBookReference = async (
	id: string,
	payload: Partial<BookReferences>,
) => {
	const res = await tables.updateRow<BookReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_REFERENCES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteBookReference = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_REFERENCES,
		rowId: id,
	});
};
