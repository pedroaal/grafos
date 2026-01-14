import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Clients } from "~/types/appwrite";

export const listClients = async (
	tenantId: string,
	options?: {
		clientCompanyId?: string;
		followUp?: boolean;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("tenantId", tenantId),
	];
	if (options?.clientCompanyId)
		queries.push(Query.equal("clientCompanyId", options.clientCompanyId));
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
