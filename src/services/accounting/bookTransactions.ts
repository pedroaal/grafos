import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { BookTransactions } from "~/types/appwrite";

export const listBookTransactions = async (options: {
	dateFrom?: string;
	dateTo?: string;
	transactionType?: boolean;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [Query.limit(perPage), Query.offset((page - 1) * perPage)];
	if (options?.dateFrom)
		queries.push(Query.equal("dateFrom", options.dateFrom));
	if (options?.dateTo) queries.push(Query.equal("dateTo", options.dateTo));
	if (options?.transactionType !== undefined)
		queries.push(Query.equal("transactionType", options.transactionType));

	const res = await tables.listRows<BookTransactions>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_TRANSACTIONS,
		queries,
	});

	return res;
};

export const getBookTransaction = async (id: string) => {
	const res = await tables.getRow<BookTransactions>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_TRANSACTIONS,
		rowId: id,
	});
	return res;
};

export const createBookTransaction = async (payload: BookTransactions) => {
	const res = await tables.createRow<BookTransactions>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_TRANSACTIONS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateBookTransaction = async (
	id: string,
	payload: Partial<BookTransactions>,
) => {
	const res = await tables.updateRow<BookTransactions>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_TRANSACTIONS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteBookTransaction = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_TRANSACTIONS,
		rowId: id,
	});
};
