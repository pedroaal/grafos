import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Attendance } from "~/types/appwrite";

/**
 * List attendance with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.userId - Filter by user ID
 * @param options.date - Filter by date
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listAttendance = async (options?: {
	userId?: string;
	date?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.date) queries.push(Query.equal("date", options.date));

	const res = await tables.listRows<Attendance>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ATTENDANCE,
		queries,
	});
	return res;
};

export const getAttendance = async (id: string) => {
	const res = await tables.getRow<Attendance>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ATTENDANCE,
		rowId: id,
	});
	return res;
};

export const createAttendance = async (payload: Attendance) => {
	const res = await tables.createRow<Attendance>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ATTENDANCE,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateAttendance = async (
	id: string,
	payload: Partial<Attendance>,
) => {
	const res = await tables.updateRow<Attendance>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ATTENDANCE,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteAttendance = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ATTENDANCE,
		rowId: id,
	});
};
