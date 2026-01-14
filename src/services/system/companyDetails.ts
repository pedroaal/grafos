import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { CompanyDetails } from "~/types/appwrite";

export const getCompanyDetailsByCompany = async (tenantId: string) => {
	const res = await tables.listRows<CompanyDetails>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_DETAILS,
		queries: [Query.equal("tenantId", tenantId)],
	});
	return res;
};

export const getCompanyDetails = async (id: string) => {
	const res = await tables.getRow<CompanyDetails>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_DETAILS,
		rowId: id,
	});
	return res;
};

export const createCompanyDetails = async (payload: CompanyDetails) => {
	const res = await tables.createRow<CompanyDetails>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_DETAILS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCompanyDetails = async (
	id: string,
	payload: Partial<CompanyDetails>,
) => {
	const res = await tables.updateRow<CompanyDetails>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_DETAILS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCompanyDetails = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMPANY_DETAILS,
		rowId: id,
	});
};
