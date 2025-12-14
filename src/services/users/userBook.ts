import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { UserBook } from "~/types/appwrite";

export const listUserBooks = async (userId?: string) => {
	const queries = [Query.isNull("deletedAt")];
	if (userId) queries.push(Query.equal("userId", userId));

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
