import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listUsers(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.USERS);
	let docs = res.documents as AppUser[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getUser(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.USERS, id);
	return res as AppUser;
}

export const createUser(payload: Partial<AppUser>) {
	// Use with caution on client; prefer server-side operations for sensitive fields.
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.USERS,
		makeId(),
		payload,
	);
	return res as AppUser;
}

export const updateUser(id: string, payload: Partial<AppUser>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.USERS, id, payload);
	return res as AppUser;
}

export const deleteUser(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.USERS, id);
}
