import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listProfiles(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PROFILES);
	let docs = res.documents as Profile[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getProfile(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PROFILES, id);
	return res as Profile;
}

export const createProfile(payload: Partial<Profile>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PROFILES,
		makeId(),
		payload,
	);
	return res as Profile;
}

export const updateProfile(id: string, payload: Partial<Profile>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.PROFILES, id, payload);
	return res as Profile;
}

export const deleteProfile(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PROFILES, id);
}
