import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { BookReferences } from "~/types/appwrite";

export const listBookReferences = async (tenantId: string) => {
	const res = await tables.listRows<BookReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BOOK_REFERENCES,
		queries: [Query.isNull("deletedAt"), Query.equal("tenantId", tenantId)],
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
