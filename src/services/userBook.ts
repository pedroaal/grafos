import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listUserBooks(userId?: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.USER_BOOK);
	let docs = res.documents as UserBook[];
	if (userId) docs = docs.filter((d) => d.userId === userId);
	return res;
}

export const getUserBook(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.USER_BOOK, id);
	return res as UserBook;
}

/**
 * Prefer server-side operations for linking books to users (role enforcement).
 */
export const createUserBook(payload: Partial<UserBook>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.USER_BOOK,
		makeId(),
		payload,
	);
	return res as UserBook;
}

export const updateUserBook(id: string, payload: Partial<UserBook>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.USER_BOOK,
		id,
		payload,
	);
	return res as UserBook;
}

export const deleteUserBook(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.USER_BOOK, id);
}
