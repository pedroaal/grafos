import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listProcesses(options?: {
	companyId: string;
	parentId?: string | null;
	type?: boolean | null;
	followUp?: boolean | null;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PROCESSES);
	let docs = res.documents as Process[];

	if (options?.companyId)
		docs = docs.filter((p) => p.companyId === options.companyId);
	if (options?.parentId !== undefined)
		docs = docs.filter((p) => (p.parentId ?? null) === options.parentId);
	if (typeof options?.type === "boolean")
		docs = docs.filter((p) => p.type === options.type);
	if (typeof options?.followUp === "boolean")
		docs = docs.filter((p) => p.followUp === options.followUp);

	// Apply parentId ordering ASC when present
	docs = docs.sort((a, b) => {
		const aParent = a.parentId ?? "";
		const bParent = b.parentId ?? "";
		if (aParent < bParent) return -1;
		if (aParent > bParent) return 1;
		return 0;
	});

	return res;
}

export const getProcess(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PROCESSES, id);
	return res as Process;
}

export const createProcess(payload: Partial<Process>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PROCESSES,
		makeId(),
		payload,
	);
	return res as Process;
}

export const updateProcess(id: string, payload: Partial<Process>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PROCESSES,
		id,
		payload,
	);
	return res as Process;
}

export const deleteProcess(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PROCESSES, id);
}
