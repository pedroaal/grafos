import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Templates } from "~/types/appwrite";

export const listTemplates = async (tenantId: string) => {
	const res = await tables.listRows<Templates>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TEMPLATES,
		queries: [Query.isNull("deletedAt"), Query.equal("tenantId", tenantId)],
	});
	return res;
};

export const getTemplate = async (id: string) => {
	const res = await tables.getRow<Templates>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TEMPLATES,
		rowId: id,
	});
	return res;
};

export const createTemplate = async (payload: Templates) => {
	const res = await tables.createRow<Templates>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TEMPLATES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateTemplate = async (id: string, payload: Templates) => {
	const res = await tables.updateRow<Templates>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TEMPLATES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteTemplate = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.TEMPLATES,
		rowId: id,
	});
};
