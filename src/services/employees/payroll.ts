import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Payroll } from "~/types/appwrite";

export const listPayrolls = async (options: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Payroll>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL,
		queries,
	});
	return res;
};

export const getPayroll = async (id: string) => {
	const res = await tables.getRow<Payroll>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL,
		rowId: id,
	});
	return res;
};

export const createPayroll = async (payload: Payroll) => {
	const res = await tables.createRow<Payroll>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayroll = async (id: string, payload: Partial<Payroll>) => {
	const res = await tables.updateRow<Payroll>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayroll = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL,
		rowId: id,
	});
};
