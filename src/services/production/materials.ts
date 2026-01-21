import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Materials } from "~/types/appwrite";

export const listMaterials = async (options?: {
	categoryId?: string;
	search?: string;
}) => {
	const queries = [Query.select(["*", "categoryId.name"])];
	if (options?.categoryId)
		queries.push(Query.equal("categoryId", options.categoryId));
	if (options?.search) queries.push(Query.equal("description", options.search));

	const res = await tables.listRows<Materials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIALS,
		queries,
	});

	return res;
};

export const getMaterial = async (id: string) => {
	const res = await tables.getRow<Materials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIALS,
		rowId: id,
	});
	return res;
};

export const createMaterial = async (tenantId: string, payload: Materials) => {
	const res = await tables.createRow<Materials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIALS,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateMaterial = async (
	id: string,
	payload: Partial<Materials>,
) => {
	const res = await tables.updateRow<Materials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIALS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteMaterial = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIALS,
		rowId: id,
	});
};
