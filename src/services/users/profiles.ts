import { Permission, Role } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Profiles } from "~/types/appwrite";

export const listProfiles = async () => {
	const res = await tables.listRows<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
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

export const createProfile = async (payload: Profiles, tenantId: string) => {
	const res = await tables.createRow<Profiles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILES,
		rowId: makeId(),
		data: payload,
		permissions: [
			Permission.read(Role.team(tenantId)),
			Permission.update(Role.team(tenantId)),
			Permission.delete(Role.team(tenantId)),
		],
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
