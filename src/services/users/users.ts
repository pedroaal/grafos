import { Permission, Query, Role } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Users } from "~/types/appwrite";

/**
 * List users with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.authId - Filter by auth ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listUsers = async (options?: {
	authId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
		Query.select(["*", "profileId.name"]),
	];
	if (options?.authId) {
		queries.push(Query.equal("authId", options.authId));
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
