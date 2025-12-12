import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listCostCenters(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.COST_CENTERS);
	let docs = res.documents as CostCenter[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getCostCenter(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.COST_CENTERS, id);
	return res as CostCenter;
}

export const createCostCenter(payload: Partial<CostCenter>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.COST_CENTERS,
		makeId(),
		payload,
	);
	return res as CostCenter;
}

export const updateCostCenter(
	id: string,
	payload: Partial<CostCenter>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.COST_CENTERS,
		id,
		payload,
	);
	return res as CostCenter;
}

export const deleteCostCenter(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.COST_CENTERS, id);
}
