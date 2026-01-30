import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Processes } from "~/types/appwrite";

export const listProcesses = async (options?: {
	type?: boolean;
	followUp?: boolean;
}) => {
	const queries = [Query.select(["*", "areaId.name"])];
	if (options?.type !== undefined)
		queries.push(Query.equal("type", options.type));
	if (options?.followUp !== undefined)
		queries.push(Query.equal("followUp", options.followUp));

	const res = await tables.listRows<Processes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROCESSES,
		queries,
	});

	return res;
};

export const getProcess = async (id: string) => {
	const res = await tables.getRow<Processes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROCESSES,
		rowId: id,
	});
	return res;
};

export const createProcess = async (tenantId: string, payload: Processes) => {
	const res = await tables.createRow<Processes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROCESSES,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateProcess = async (
	id: string,
	payload: Partial<Processes>,
) => {
	const res = await tables.updateRow<Processes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROCESSES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteProcess = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROCESSES,
		rowId: id,
	});
};
