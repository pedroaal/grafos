import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Modules } from "~/types/appwrite";

export const listModules = async (companyId: string) => {
	const res = await tables.listRows<Modules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
	});
	return res;
};

export const getModule = async (id: string) => {
	const res = await tables.getRow<Modules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
		rowId: id,
	});
	return res;
};

export const createModule = async (payload: Modules) => {
	const res = await tables.createRow<Modules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateModule = async (id: string, payload: Partial<Modules>) => {
	const res = await tables.updateRow<Modules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteModule = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
		rowId: id,
	});
};
