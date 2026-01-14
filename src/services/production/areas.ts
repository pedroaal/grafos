import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Areas } from "~/types/appwrite";

export const listAreas = async (
	tenantId: string,
	options?: {
		sort?: "asc" | "desc";
	},
) => {
	const queries = [
		Query.isNull("deletedAt"),
		Query.equal("tenantId", tenantId),
	];
	if (options?.sort) queries.push(Query.orderAsc("sortOrder"));

	const res = await tables.listRows<Areas>({
		databaseId: DATABASE_ID,
		tableId: TABLES.AREAS,
		queries,
	});

	return res;
};

export const getArea = async (id: string) => {
	const res = await tables.getRow<Areas>({
		databaseId: DATABASE_ID,
		tableId: TABLES.AREAS,
		rowId: id,
	});
	return res;
};

export const createArea = async (payload: Areas) => {
	const res = await tables.createRow<Areas>({
		databaseId: DATABASE_ID,
		tableId: TABLES.AREAS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateArea = async (id: string, payload: Partial<Areas>) => {
	const res = await tables.updateRow<Areas>({
		databaseId: DATABASE_ID,
		tableId: TABLES.AREAS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteArea = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.AREAS,
		rowId: id,
	});
};
