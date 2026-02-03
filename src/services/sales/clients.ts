import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Clients } from "~/types/appwrite";

export const listClients = async (options: {
	companyId?: string;
	followUp?: boolean;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
		Query.select(["*", "companyId.name", "contactId.firstName", "contactId.lastName", "contactId.phone", "contactId.mobile", "contactId.email"]),
	];
	if (options?.companyId)
		queries.push(Query.equal("companyId", options.companyId));
	if (typeof options?.followUp === "boolean")
		queries.push(Query.equal("followUp", options.followUp));

	const res = await tables.listRows<Clients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENTS,
		queries,
	});
	return res;
};

export const getClient = async (id: string) => {
	const res = await tables.getRow<Clients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		rowId: id,
	});
	return res;
};

export const createClient = async (payload: Clients) => {
	const res = await tables.createRow<Clients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateClient = async (id: string, payload: Partial<Clients>) => {
	const res = await tables.updateRow<Clients>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteClient = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENTS,
		rowId: id,
	});
};
