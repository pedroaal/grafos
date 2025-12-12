import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listBookTransactions(options?: {
	companyId: string;
	dateFrom?: string; // ISO
	dateTo?: string; // ISO
	transactionType?: boolean;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.BOOK_TRANSACTIONS);
	let docs = res.documents as BookTransaction[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.transactionType !== undefined)
		docs = docs.filter((d) => d.transactionType === options.transactionType);
	if (options?.dateFrom)
		docs = docs.filter(
			(d) => new Date(d.transactionDate) >= new Date(options.dateFrom),
		);
	if (options?.dateTo)
		docs = docs.filter(
			(d) => new Date(d.transactionDate) <= new Date(options.dateTo),
		);

	// default: return newest first (client-side). For large sets use Query with transactionDateIdx.
	docs = docs.sort((a, b) =>
		(b.transactionDate ?? "").localeCompare(a.transactionDate ?? ""),
	);

	return res;
}

export const getBookTransaction(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.BOOK_TRANSACTIONS, id);
	return res as BookTransaction;
}

/**
 * Use server-side flows to ensure ledger consistency. The direct create below is provided for completeness.
 */
export const createBookTransaction(payload: Partial<BookTransaction>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.BOOK_TRANSACTIONS,
		makeId(),
		payload,
	);
	return res as BookTransaction;
}

export const updateBookTransaction(
	id: string,
	payload: Partial<BookTransaction>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.BOOK_TRANSACTIONS,
		id,
		payload,
	);
	return res as BookTransaction;
}

export const deleteBookTransaction(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.BOOK_TRANSACTIONS, id);
}
