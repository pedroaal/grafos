import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { UserProcesses } from "~/types/appwrite";

export const listUserProcesses = async (options: {
	userId?: string;
	processId?: string;
}) => {
	const queries = [];
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
