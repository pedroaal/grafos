import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { UserProcesses } from "~/types/appwrite";

/**
 * List user processes with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.userId - Filter by user ID
 * @param options.processId - Filter by process ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listUserProcesses = async (options?: {
	userId?: string;
	processId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.processId)
		queries.push(Query.equal("processId", options.processId));

	const res = await tables.listRows<UserProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_PROCESSES,
		queries,
	});
	return res;
};

export const getUserProcess = async (id: string) => {
	const res = await tables.getRow<UserProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_PROCESSES,
		rowId: id,
	});
	return res;
};

export const createUserProcess = async (payload: UserProcesses) => {
	const res = await tables.createRow<UserProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_PROCESSES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateUserProcess = async (
	id: string,
	payload: Partial<UserProcesses>,
) => {
	const res = await tables.updateRow<UserProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_PROCESSES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteUserProcess = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.USER_PROCESSES,
		rowId: id,
	});
};
