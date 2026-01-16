import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderMaterials } from "~/types/appwrite";

export const listOrderMaterials = async (options?: {
	orderId?: string;
	supplierId?: string;
}) => {
	const queries = [Query.isNull("deletedAt")];
	if (options?.orderId) queries.push(Query.equal("orderId", options.orderId));
	if (options?.supplierId)
		queries.push(Query.equal("supplierId", options.supplierId));

	const res = await tables.listRows<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		queries,
	});
	return res;
};

export const getMaterialRequest = async (id: string) => {
	const res = await tables.getRow<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: id,
	});
	return res;
};

export const createMaterialRequest = async (payload: OrderMaterials) => {
	const res = await tables.createRow<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateMaterialRequest = async (
	id: string,
	payload: Partial<OrderMaterials>,
) => {
	const res = await tables.updateRow<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteMaterialRequest = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: id,
	});
};
