import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { BankAccounts } from "~/types/appwrite";

export const listBankAccounts = async (options: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<BankAccounts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BANK_ACCOUNTS,
		queries,
	});
	return res;
};

export const getBankAccount = async (id: string) => {
	const res = await tables.getRow<BankAccounts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BANK_ACCOUNTS,
		rowId: id,
	});
	return res;
};

export const createBankAccount = async (payload: BankAccounts) => {
	const res = await tables.createRow<BankAccounts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BANK_ACCOUNTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateBankAccount = async (
	id: string,
	payload: Partial<BankAccounts>,
) => {
	const res = await tables.updateRow<BankAccounts>({
		databaseId: DATABASE_ID,
		tableId: TABLES.BANK_ACCOUNTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteBankAccount = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.BANK_ACCOUNTS,
		rowId: id,
	});
};
