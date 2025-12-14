import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ClientCompanies } from "~/types/appwrite";

export const listClientCompanies = async (companyId: string) => {
	const res = await tables.listRows<ClientCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_COMPANIES,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
	});
	return res;
};

export const getClientCompany = async (id: string) => {
	const res = await tables.getRow<ClientCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_COMPANIES,
		rowId: id,
	});
	return res;
};

export const createClientCompany = async (payload: ClientCompanies) => {
	const res = await tables.createRow<ClientCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_COMPANIES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateClientCompany = async (
	id: string,
	payload: Partial<ClientCompanies>,
) => {
	const res = await tables.updateRow<ClientCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_COMPANIES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteClientCompany = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_COMPANIES,
		rowId: id,
	});
};
