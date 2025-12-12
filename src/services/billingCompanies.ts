import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { BillingCompanies } from "~/types/appwrite";

export const listBillingCompanies = async (companyId: string) => {
	const res = await tables.listRows<BillingCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BILLING_COMPANIES,
		queries: [
			Query.equal("deletedAt", false),
			Query.equal("companyId", companyId),
		],
	});
	return res;
};

export const getBillingCompany = async (id: string) => {
	const res = await tables.getRow<BillingCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BILLING_COMPANIES,
		rowId: id,
	});
	return res;
};

export const createBillingCompany = async (payload: BillingCompanies) => {
	const res = await tables.createRow<BillingCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BILLING_COMPANIES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateBillingCompany = async (
	id: string,
	payload: Partial<BillingCompanies>,
) => {
	const res = await tables.updateRow<BillingCompanies>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BILLING_COMPANIES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteBillingCompany = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.BILLING_COMPANIES,
		rowId: id,
	});
};
