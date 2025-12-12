import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listOrderProcesses(options?: {
	orderId?: string;
	status?: boolean;
}) {
	const res = await tables.listRows<>(
		DATABASE_ID,
		TABLES["ORDER-PROCESSES"] ??
			TABLES["ORDER_PROCESSES"] ??
			TABLES["ORDER_PROCESSES"],
	);
	// Some apps keep different naming; normalize fallback to TABLES.ORDER_PROCESSES if you added it accordingly.
	// To avoid runtime issues, prefer using TABLES.ORDER_PROCESSES in src/lib/appwrite.ts. Below we assume TABLES contains key ORDER_PROCESSES mapped to "order-processes".
	// If not present, replace the collection id string with "order-processes".
	const docs = res.documents as OrderProcess[];
	let filtered = docs;

	if (options?.orderId)
		filtered = filtered.filter((op) => op.orderId === options.orderId);
	if (typeof options?.status === "boolean")
		filtered = filtered.filter((op) => op.status === options.status);

	return filtered;
}

export const getOrderProcess(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, "order-processes", id);
	return res as OrderProcess;
}

export const createOrderProcess(payload: Partial<OrderProcess>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		"order-processes",
		makeId(),
		payload,
	);
	return res as OrderProcess;
}

export const updateOrderProcess(
	id: string,
	payload: Partial<OrderProcess>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		"order-processes",
		id,
		payload,
	);
	return res as OrderProcess;
}

export const deleteOrderProcess(id: string) {
	return tables.deleteRow(DATABASE_ID, "order-processes", id);
}
