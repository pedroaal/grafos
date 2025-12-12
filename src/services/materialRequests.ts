import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listMaterialRequests(options?: {
	orderId?: string;
	supplierId?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.MATERIAL_REQUESTS);
	let docs = res.documents as MaterialRequest[];

	if (options?.orderId)
		docs = docs.filter((d) => d.orderId === options.orderId);
	if (options?.supplierId)
		docs = docs.filter((d) => d.supplierId === options.supplierId);

	return res;
}

export const getMaterialRequest(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.MATERIAL_REQUESTS, id);
	return res as MaterialRequest;
}

export const createMaterialRequest(payload: Partial<MaterialRequest>) {
	// Validate payload.quantity, total and numeric ranges on server-side if required
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.MATERIAL_REQUESTS,
		makeId(),
		payload,
	);
	return res as MaterialRequest;
}

export const updateMaterialRequest(
	id: string,
	payload: Partial<MaterialRequest>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.MATERIAL_REQUESTS,
		id,
		payload,
	);
	return res as MaterialRequest;
}

export const deleteMaterialRequest(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.MATERIAL_REQUESTS, id);
}
