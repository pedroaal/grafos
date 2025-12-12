import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listRoles() {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.ROLES);
	return res.documents as Role[];
}

export const getRole(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.ROLES, id);
	return res as Role;
}

export const createRole(payload: Partial<Role>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.ROLES,
		makeId(),
		payload,
	);
	return res as Role;
}

export const updateRole(id: string, payload: Partial<Role>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.ROLES, id, payload);
	return res as Role;
}

export const deleteRole(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.ROLES, id);
}
