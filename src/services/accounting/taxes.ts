import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Taxes } from "~/types/appwrite";

export const listTaxes = async (options: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Taxes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TAXES,
		queries,
	});
	return res;
};

export const getTax = async (id: string) => {
	const res = await tables.getRow<Taxes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TAXES,
		rowId: id,
	});
	return res;
};

export const createTax = async (payload: Taxes) => {
	const res = await tables.createRow<Taxes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TAXES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateTax = async (id: string, payload: Partial<Taxes>) => {
	const res = await tables.updateRow<Taxes>({
		databaseId: DATABASE_ID,
		tableId: TABLES.TAXES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteTax = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.TAXES,
		rowId: id,
	});
};
