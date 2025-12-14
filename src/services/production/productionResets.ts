import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProductionResets } from "~/types/appwrite";

export const listProductionResets = async (companyId: string) => {
	const res = await tables.listRows<ProductionResets>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTION_RESETS,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
	});

	return res;
};

export const getProductionReset = async (id: string) => {
	const res = await tables.getRow<ProductionResets>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTION_RESETS,
		rowId: id,
	});
	return res;
};

export const createProductionReset = async (payload: ProductionResets) => {
	const res = await tables.createRow<ProductionResets>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTION_RESETS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateProductionReset = async (
	id: string,
	payload: Partial<ProductionResets>,
) => {
	const res = await tables.updateRow<ProductionResets>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTION_RESETS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteProductionReset = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PRODUCTION_RESETS,
		rowId: id,
	});
};
