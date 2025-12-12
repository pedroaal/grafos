import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listClientCompanies(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CLIENT_COMPANIES);
	let docs = res.documents as ClientCompany[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getClientCompany(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CLIENT_COMPANIES, id);
	return res as ClientCompany;
}

export const createClientCompany(payload: Partial<ClientCompany>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CLIENT_COMPANIES,
		makeId(),
		payload,
	);
	return res as ClientCompany;
}

export const updateClientCompany(
	id: string,
	payload: Partial<ClientCompany>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.CLIENT_COMPANIES,
		id,
		payload,
	);
	return res as ClientCompany;
}

export const deleteClientCompany(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CLIENT_COMPANIES, id);
}
