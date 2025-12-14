import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Schedules } from "~/types/appwrite";

export const listSchedules = async (companyId: string) => {
	const res = await tables.listRows<Schedules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SCHEDULES,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
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
