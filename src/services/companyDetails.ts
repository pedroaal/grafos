import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const getCompanyDetailsByCompany(companyId: string) {
	// company-details is one-to-one with companies; we fetch and return the first match
	const res = await tables.listRows<>(DATABASE_ID, TABLES.COMPANY_DETAILS);
	const docs = res.documents as CompanyDetails[];
	return docs.find((d) => d.companyId === companyId) ?? null;
}

export const getCompanyDetails(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.COMPANY_DETAILS, id);
	return res as CompanyDetails;
}

export const createCompanyDetails(payload: Partial<CompanyDetails>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.COMPANY_DETAILS,
		makeId(),
		payload,
	);
	return res as CompanyDetails;
}

export const updateCompanyDetails(
	id: string,
	payload: Partial<CompanyDetails>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.COMPANY_DETAILS,
		id,
		payload,
	);
	return res as CompanyDetails;
}

export const deleteCompanyDetails(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.COMPANY_DETAILS, id);
}
