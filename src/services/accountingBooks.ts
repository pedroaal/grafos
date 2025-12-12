import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBooks } from "~/types/appwrite.d";

export const listAccountingBooks = async (companyId: string) => {
	const res = await tables.listRows<AccountingBooks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACCOUNTING_BOOKS,
		queries: [
			Query.equal("deletedAt", false),
			Query.equal("companyId", companyId),
		],
	});
	return res;
};

export const getAccountingBook = async (id: string) => {
	const res = await tables.getRow<AccountingBooks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACCOUNTING_BOOKS,
		rowId: id,
	});
	return res;
};

export const createAccountingBook = async (payload: AccountingBooks) => {
	const res = await tables.createRow<AccountingBooks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACCOUNTING_BOOKS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateAccountingBook = async (
	id: string,
	payload: Partial<AccountingBooks>,
) => {
	const res = await tables.updateRow<AccountingBooks>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACCOUNTING_BOOKS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteAccountingBook = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACCOUNTING_BOOKS,
		rowId: id,
	});
};
