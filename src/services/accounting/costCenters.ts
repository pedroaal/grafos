import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { CostCenters } from "~/types/appwrite";

/**
 * List cost centers with optional pagination
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listCostCenters = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<CostCenters>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COST_CENTERS,
		queries,
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
