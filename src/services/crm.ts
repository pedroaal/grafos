import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listCrm(options?: {
	companyId: string;
	assignedId?: string;
	contactId?: string;
	status?: boolean;
	dateFrom?: string;
	dateTo?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CRM);
	let docs = res.documents as Crm[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.assignedId)
		docs = docs.filter((d) => d.assignedId === options.assignedId);
	if (options?.contactId)
		docs = docs.filter((d) => d.contactId === options.contactId);
	if (typeof options?.status === "boolean")
		docs = docs.filter((d) => d.status === options.status);
	if (options?.dateFrom)
		docs = docs.filter(
			(d) => new Date(d.scheduled) >= new Date(options.dateFrom),
		);
	if (options?.dateTo)
		docs = docs.filter(
			(d) => new Date(d.scheduled) <= new Date(options.dateTo),
		);

	// default: newest scheduled first
	docs = docs.sort((a, b) =>
		(b.scheduled ?? "").localeCompare(a.scheduled ?? ""),
	);

	return res;
}

export const getCrm(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CRM, id);
	return res as Crm;
}

/**
 * Prefer server-side validation and permission checks for CRM modifications.
 */
export const createCrm(payload: Partial<Crm>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CRM,
		makeId(),
		payload,
	);
	return res as Crm;
}

export const updateCrm(id: string, payload: Partial<Crm>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.CRM, id, payload);
	return res as Crm;
}

export const deleteCrm(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CRM, id);
}
