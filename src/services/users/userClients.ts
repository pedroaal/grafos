import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { UserClients } from "~/types/appwrite";

/**
 * List user clients with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.userId - Filter by user ID
 * @param options.clientId - Filter by client ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listUserClients = async (options?: {
	userId?: string;
	clientId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.clientId)
		queries.push(Query.equal("clientId", options.clientId));

	const res = await tables.listRows<UserClients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_CLIENTS,
		queries,
	});
	return res;
};

export const getClientFollower = async (id: string) => {
	const res = await tables.getRow<UserClients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_CLIENTS,
		rowId: id,
	});
	return res;
};

export const createClientFollower = async (payload: UserClients) => {
	const res = await tables.createRow<UserClients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_CLIENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateClientFollower = async (
	id: string,
	payload: Partial<UserClients>,
) => {
	const res = await tables.updateRow<UserClients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_CLIENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteClientFollower = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_CLIENTS,
		rowId: id,
	});
};
