import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Profiles } from "~/types/appwrite";

export const listProfiles = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const queries = [];

	// Add pagination
	if (options?.page && options?.perPage) {
		const offset = (options.page - 1) * options.perPage;
		queries.push(Query.limit(options.perPage));
		queries.push(Query.offset(offset));
	}

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
