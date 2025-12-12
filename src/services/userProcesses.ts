import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listUserProcesses(options?: {
	userId?: string;
	processId?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.USER_PROCESSES);
	let docs = res.documents as UserProcess[];

	if (options?.userId) docs = docs.filter((d) => d.userId === options.userId);
	if (options?.processId)
		docs = docs.filter((d) => d.processId === options.processId);

	return res;
}

export const getUserProcess(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.USER_PROCESSES, id);
	return res as UserProcess;
}

export const createUserProcess(payload: Partial<UserProcess>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.USER_PROCESSES,
		makeId(),
		payload,
	);
	return res as UserProcess;
}

export const updateUserProcess(
	id: string,
	payload: Partial<UserProcess>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.USER_PROCESSES,
		id,
		payload,
	);
	return res as UserProcess;
}

export const deleteUserProcess(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.USER_PROCESSES, id);
}
