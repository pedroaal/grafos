import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Crm } from "~/types/appwrite";

export const listCrm = async (
	companyId: string,
	options?: {
		assignedId?: string;
		contactId?: string;
		status?: boolean;
		dateFrom?: string;
		dateTo?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("companyId", companyId),
	];
	if (options?.assignedId)
		queries.push(Query.equal("assignedId", options.assignedId));
	if (options?.contactId)
		queries.push(Query.equal("contactId", options.contactId));
	if (typeof options?.status === "boolean")
		queries.push(Query.equal("status", options.status));
	if (options?.dateFrom)
		queries.push(Query.greaterThan("scheduled", options.dateFrom));
	if (options?.dateTo)
		queries.push(Query.lessThan("scheduled", options.dateTo));

	const res = await tables.listRows<Crm>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CRM,
		queries,
	});

	return res;
};

export const getCrm = async (id: string) => {
	const res = await tables.getRow<Crm>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CRM,
		rowId: id,
	});
	return res;
};

export const createCrm = async (payload: Crm) => {
	const res = await tables.createRow<Crm>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CRM,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCrm = async (id: string, payload: Partial<Crm>) => {
	const res = await tables.updateRow<Crm>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CRM,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCrm = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CRM,
		rowId: id,
	});
};
