import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProfileModules } from "~/types/appwrite";

export const listProfileModules = async (profileId?: string) => {
	const queries = [Query.isNull("deletedAt")];
	if (profileId) queries.push(Query.equal("profileId", profileId));

	const res = await tables.listRows<ProfileModules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_MODULES,
		queries,
	});
	return res;
};

export const getProfileModule = async (id: string) => {
	const res = await tables.getRow<ProfileModules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_MODULES,
		rowId: id,
	});
	return res;
};

export const createProfileModule = async (payload: ProfileModules) => {
	const res = await tables.createRow<ProfileModules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_MODULES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateProfileModule = async (
	id: string,
	payload: Partial<ProfileModules>,
) => {
	const res = await tables.updateRow<ProfileModules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_MODULES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteProfileModule = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_MODULES,
		rowId: id,
	});
};
