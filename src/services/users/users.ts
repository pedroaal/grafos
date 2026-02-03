import { Permission, Query, Role } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Users } from "~/types/appwrite";

export const listUsers = async (options?: {
	authId?: string;
	page?: number;
	perPage?: number;
}) => {
	const queries = [Query.select(["*", "profileId.name"])];
	if (options?.authId) {
		queries.push(Query.equal("authId", options.authId));
	}

	// Add pagination
	if (options?.page && options?.perPage) {
		const offset = (options.page - 1) * options.perPage;
		queries.push(Query.limit(options.perPage));
		queries.push(Query.offset(offset));
	}

	const res = await tables.listRows<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		queries,
	});
	return res;
};

export const getUser = async (rowId: string) => {
	const res = await tables.getRow<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId,
	});
	return res;
};

export const getUserByAuthId = async (authId: string) => {
	const res = await tables.listRows<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		queries: [Query.equal("authId", authId)],
	});
	return res;
};

export const createUser = async (tenantId: string, payload: Users) => {
	const res = await tables.createRow<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateUser = async (rowId: string, payload: Partial<Users>) => {
	const res = await tables.updateRow<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId,
		data: payload,
	});
	return res;
};

export const deleteUser = (rowId: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId,
	});
};
