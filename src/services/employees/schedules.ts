import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Schedules } from "~/types/appwrite";

/**
 * List schedules with optional pagination
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listSchedules = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Schedules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SCHEDULES,
		queries,
	});
	return res;
};

export const getSchedule = async (id: string) => {
	const res = await tables.getRow<Schedules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SCHEDULES,
		rowId: id,
	});
	return res;
};

export const createSchedule = async (payload: Schedules) => {
	const res = await tables.createRow<Schedules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SCHEDULES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateSchedule = async (
	id: string,
	payload: Partial<Schedules>,
) => {
	const res = await tables.updateRow<Schedules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SCHEDULES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteSchedule = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.SCHEDULES,
		rowId: id,
	});
};
