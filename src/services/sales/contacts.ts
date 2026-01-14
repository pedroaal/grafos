import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Contacts } from "~/types/appwrite";

export const listContacts = async (
	companyId: string,
	options?: {
		clientCompanyId?: string;
		searchName?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("tenantId", tenantId),
	];
	if (options?.clientCompanyId)
		queries.push(Query.equal("clientCompanyId", options.clientCompanyId));
	if (options?.searchName)
		queries.push(Query.equal("name", options.searchName));

	const res = await tables.listRows<Contacts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CONTACTS,
		queries,
	});

	return res;
};

export const getContact = async (id: string) => {
	const res = await tables.getRow<Contacts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CONTACTS,
		rowId: id,
	});
	return res;
};

export const createContact = async (payload: Contacts) => {
	const res = await tables.createRow<Contacts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CONTACTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateContact = async (id: string, payload: Partial<Contacts>) => {
	const res = await tables.updateRow<Contacts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CONTACTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteContact = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CONTACTS,
		rowId: id,
	});
};
