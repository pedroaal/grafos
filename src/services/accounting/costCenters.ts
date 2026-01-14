import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { CostCenters } from "~/types/appwrite";

export const listCostCenters = async (tenantId: string) => {
	const res = await tables.listRows<CostCenters>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COST_CENTERS,
		queries: [Query.isNull("deletedAt"), Query.equal("tenantId", tenantId)],
	});
	return res;
};

export const getCostCenter = async (id: string) => {
	const res = await tables.getRow<CostCenters>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COST_CENTERS,
		rowId: id,
	});
	return res;
};

export const createCostCenter = async (payload: CostCenters) => {
	const res = await tables.createRow<CostCenters>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COST_CENTERS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCostCenter = async (
	id: string,
	payload: Partial<CostCenters>,
) => {
	const res = await tables.updateRow<CostCenters>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COST_CENTERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCostCenter = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.COST_CENTERS,
		rowId: id,
	});
};
