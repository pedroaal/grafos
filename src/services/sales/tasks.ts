import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Task } from "~/types/appwrite";

export const listTask = async (options: {
	assignedId?: string;
	contactId?: string;
	status?: boolean;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [Query.limit(perPage), Query.offset((page - 1) * perPage)];
	if (options?.assignedId)
		queries.push(Query.equal("assignedId", options.assignedId));
	if (options?.contactId)
		queries.push(Query.equal("contactId", options.contactId));
	if (typeof options?.status === "boolean")
		queries.push(Query.equal("status", options.status));
	if (options?.dateFrom)
		queries.push(Query.greaterThan("scheduled", options.dateFrom));
	if (options?.dateTo)
		queries.push(Query.lessThan("scheduled", options.dateTo));

	const res = await tables.listRows<Task>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TASKS,
		queries,
	});

	return res;
};

export const getTask = async (id: string) => {
	const res = await tables.getRow<Task>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TASKS,
		rowId: id,
	});
	return res;
};

export const createTask = async (payload: Task) => {
	const res = await tables.createRow<Task>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TASKS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateTask = async (id: string, payload: Partial<Task>) => {
	const res = await tables.updateRow<Task>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TASKS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteTask = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.TASKS,
		rowId: id,
	});
};
