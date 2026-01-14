import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Inks } from "~/types/appwrite";

export const listInks = async (
	tenantId: string,
	options?: {
		search?: string;
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("tenantId", tenantId),
	];

	if (options?.search) queries.push(Query.equal("color", options.search));

	const res = await tables.listRows<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		queries,
	});

	return res;
};

export const getInk = async (id: string) => {
	const res = await tables.getRow<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: id,
	});
	return res;
};

export const createInk = async (payload: Inks) => {
	const res = await tables.createRow<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateInk = async (id: string, payload: Partial<Inks>) => {
	const res = await tables.updateRow<Inks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteInk = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.INKS,
		rowId: id,
	});
};
