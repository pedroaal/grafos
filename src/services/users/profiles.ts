import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Profiles } from "~/types/appwrite";

export const listProfiles = async (companyId: string) => {
	const res = await tables.listRows<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
	});
	return res;
};

export const getProfile = async (id: string) => {
	const res = await tables.getRow<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId: id,
	});
	return res;
};

export const createProfile = async (payload: Profiles) => {
	const res = await tables.createRow<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateProfile = async (id: string, payload: Partial<Profiles>) => {
	const res = await tables.updateRow<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteProfile = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId: id,
	});
};
