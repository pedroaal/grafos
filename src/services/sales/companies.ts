import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Companies } from "~/types/appwrite";

export const listCompanies = async () => {
	const res = await tables.listRows<Companies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANIES,
	});
	return res;
};

export const getCompany = async (id: string) => {
	const res = await tables.getRow<Companies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANIES,
		rowId: id,
	});
	return res;
};

export const createCompany = async (payload: Companies) => {
	const res = await tables.createRow<Companies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANIES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCompany = async (
	id: string,
	payload: Partial<Companies>,
) => {
	const res = await tables.updateRow<Companies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANIES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCompany = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANIES,
		rowId: id,
	});
};
