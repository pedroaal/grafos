import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { CompanyTypes } from "~/types/appwrite";

export const listCompanyTypes = async (search?: string) => {
	const queries = [Query.isNull("deletedAt")];
	if (search) queries.push(Query.search("name", search));

	const res = await tables.listRows<CompanyTypes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_TYPES,
		queries,
	});

	return res;
};

export const getCompanyType = async (id: string) => {
	const res = await tables.getRow<CompanyTypes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_TYPES,
		rowId: id,
	});
	return res;
};

export const createCompanyType = async (payload: CompanyTypes) => {
	const res = await tables.createRow<CompanyTypes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_TYPES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCompanyType = async (
	id: string,
	payload: Partial<CompanyTypes>,
) => {
	const res = await tables.updateRow<CompanyTypes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_TYPES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCompanyType = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_TYPES,
		rowId: id,
	});
};
