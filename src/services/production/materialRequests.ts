import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { MaterialRequests } from "~/types/appwrite";

export const listMaterialRequests = async (options?: {
	orderId?: string;
	supplierId?: string;
}) => {
	const queries = [Query.isNull("deletedAt")];
	if (options?.orderId) queries.push(Query.equal("orderId", options.orderId));
	if (options?.supplierId)
		queries.push(Query.equal("supplierId", options.supplierId));

	const res = await tables.listRows<MaterialRequests>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIAL_REQUESTS,
		queries,
	});
	return res;
};

export const getMaterialRequest = async (id: string) => {
	const res = await tables.getRow<MaterialRequests>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIAL_REQUESTS,
		rowId: id,
	});
	return res;
};

export const createMaterialRequest = async (payload: MaterialRequests) => {
	const res = await tables.createRow<MaterialRequests>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIAL_REQUESTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateMaterialRequest = async (
	id: string,
	payload: Partial<MaterialRequests>,
) => {
	const res = await tables.updateRow<MaterialRequests>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIAL_REQUESTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteMaterialRequest = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.MATERIAL_REQUESTS,
		rowId: id,
	});
};
