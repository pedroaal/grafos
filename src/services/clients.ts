import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listClients(options?: {
	companyId: string;
	clientcompanyId: string;
	followUp?: boolean;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CLIENTS);
	let docs = res.documents as ClientRecord[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.clientCompanyId)
		docs = docs.filter((d) => d.clientCompanyId === options.clientCompanyId);
	if (typeof options?.followUp === "boolean")
		docs = docs.filter((d) => d.followUp === options.followUp);

	return res;
}

export const getClient(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CLIENTS, id);
	return res as ClientRecord;
}

export const createClient(payload: Partial<ClientRecord>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CLIENTS,
		makeId(),
		payload,
	);
	return res as ClientRecord;
}

export const updateClient(id: string, payload: Partial<ClientRecord>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.CLIENTS, id, payload);
	return res as ClientRecord;
}

export const deleteClient(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CLIENTS, id);
}
