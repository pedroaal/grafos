import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollFamily } from "~/types/appwrite";

export const listPayrollFamily = async (options: { payrollId?: string }) => {
	const queries = [];
	if (options?.payrollId)
		queries.push(Query.equal("payrollId", options.payrollId));

	const res = await tables.listRows<PayrollFamily>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_FAMILY,
		queries,
	});
	return res;
};

export const getPayrollFamily = async (id: string) => {
	const res = await tables.getRow<PayrollFamily>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_FAMILY,
		rowId: id,
	});
	return res;
};

export const createPayrollFamily = async (payload: PayrollFamily) => {
	const res = await tables.createRow<PayrollFamily>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_FAMILY,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayrollFamily = async (
	id: string,
	payload: Partial<PayrollFamily>,
) => {
	const res = await tables.updateRow<PayrollFamily>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_FAMILY,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayrollFamily = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_FAMILY,
		rowId: id,
	});
};
