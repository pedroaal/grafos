import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listProductionResets(limit?: number) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PRODUCTION_RESETS);
	let docs = res.documents as ProductionReset[];

	// default sort: newest first (the collection has resetTimestampIdx DESC)
	docs = docs.sort((a, b) =>
		(b.resetTimestamp ?? "").localeCompare(a.resetTimestamp ?? ""),
	);

	if (typeof limit === "number") return docs.slice(0, limit);
	return res;
}

export const getProductionReset(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PRODUCTION_RESETS, id);
	return res as ProductionReset;
}

/**
 * Prefer server-side route to perform production reset (audit, permission check, effects). This function creates a record only.
 */
export const createProductionReset(payload: Partial<ProductionReset>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PRODUCTION_RESETS,
		makeId(),
		payload,
	);
	return res as ProductionReset;
}

export const updateProductionReset(
	id: string,
	payload: Partial<ProductionReset>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PRODUCTION_RESETS,
		id,
		payload,
	);
	return res as ProductionReset;
}

export const deleteProductionReset(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PRODUCTION_RESETS, id);
}
