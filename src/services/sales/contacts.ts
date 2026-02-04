import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Contacts } from "~/types/appwrite";

export const listContacts = async (options: {
	clientCompanyId?: string;
	searchName?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [Query.limit(perPage), Query.offset((page - 1) * perPage)];
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
