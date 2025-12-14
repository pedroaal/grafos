import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { UserClients } from "~/types/appwrite";

export const listUserClients = async (options?: {
	userId?: string;
	clientId?: string;
}) => {
	const queries = [Query.isNull("deletedAt")];
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
