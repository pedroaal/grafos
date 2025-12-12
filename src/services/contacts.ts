import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listContacts(options?: {
	companyId: string;
	clientcompanyId: string;
	searchName?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CONTACTS);
	let docs = res.documents as Contact[];

	if (options?.companyId) {
		docs = docs.filter((d) => d.companyId === options.companyId);
	}
	if (options?.clientCompanyId) {
		docs = docs.filter((d) => d.clientCompanyId === options.clientCompanyId);
	}
	if (options?.searchName) {
		const q = options.searchName.toLowerCase();
		docs = docs.filter(
			(d) =>
				(d.firstName || "").toLowerCase().includes(q) ||
				(d.lastName || "").toLowerCase().includes(q),
		);
	}

	return res;
}

export const getContact(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CONTACTS, id);
	return res as Contact;
}

export const createContact(payload: Partial<Contact>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CONTACTS,
		makeId(),
		payload,
	);
	return res as Contact;
}

export const updateContact(id: string, payload: Partial<Contact>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.CONTACTS, id, payload);
	return res as Contact;
}

export const deleteContact(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CONTACTS, id);
}
