import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listCompanies() {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.COMPANIES);
	return res.documents as Company[];
}

export const getCompany(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.COMPANIES, id);
	return res as Company;
}

export const createCompany(payload: Partial<Company>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.COMPANIES,
		makeId(),
		payload,
	);
	return res as Company;
}

export const updateCompany(id: string, payload: Partial<Company>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.COMPANIES,
		id,
		payload,
	);
	return res as Company;
}

export const deleteCompany(id: string) {
	const res = await tables.deleteRow(DATABASE_ID, TABLES.COMPANIES, id);
	return res;
}
