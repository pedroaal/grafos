import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Profiles } from "~/types/appwrite";

export const listProfiles = async (options: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		queries,
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

export const createProfile = async (tenantId: string, payload: Profiles) => {
	const res = await tables.createRow<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
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

export const deleteProfile = (rowId: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId,
	});
};
