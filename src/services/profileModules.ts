import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listProfileModules(profileId?: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PROFILE_MODULES);
	let docs = res.documents as ProfileModule[];
	if (profileId) docs = docs.filter((d) => d.profileId === profileId);
	return res;
}

export const getProfileModule(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PROFILE_MODULES, id);
	return res as ProfileModule;
}

export const createProfileModule(payload: Partial<ProfileModule>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PROFILE_MODULES,
		makeId(),
		payload,
	);
	return res as ProfileModule;
}

export const updateProfileModule(
	id: string,
	payload: Partial<ProfileModule>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PROFILE_MODULES,
		id,
		payload,
	);
	return res as ProfileModule;
}

export const deleteProfileModule(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PROFILE_MODULES, id);
}
