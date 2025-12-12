import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listSchedules(companyId: string) {
	// Optionally filter client-side or use Appwrite Query if needed
	const res = await tables.listRows<>(DATABASE_ID, TABLES.SCHEDULES);
	let docs = res.documents as Schedule[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getSchedule(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.SCHEDULES, id);
	return res as Schedule;
}

export const createSchedule(payload: Partial<Schedule>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.SCHEDULES,
		makeId(),
		payload,
	);
	return res as Schedule;
}

export const updateSchedule(id: string, payload: Partial<Schedule>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.SCHEDULES,
		id,
		payload,
	);
	return res as Schedule;
}

export const deleteSchedule(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.SCHEDULES, id);
}
