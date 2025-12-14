import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Attendance } from "~/types/appwrite";

export const listAttendance = async (userId?: string, date?: string) => {
	const queries = [Query.isNull("deletedAt")];
	if (userId) queries.push(Query.equal("userId", userId));
	if (date) queries.push(Query.equal("date", date));

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
