import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollEducation } from "~/types/appwrite";

export const listPayrollEducation = async (options: {
	payrollId?: string;
}) => {
	const queries = [];
	if (options?.payrollId) queries.push(Query.equal("payrollId", options.payrollId));

	const res = await tables.listRows<PayrollEducation>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EDUCATION,
		queries,
	});
	return res;
};

export const getPayrollEducation = async (id: string) => {
	const res = await tables.getRow<PayrollEducation>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EDUCATION,
		rowId: id,
	});
	return res;
};

export const createPayrollEducation = async (payload: PayrollEducation) => {
	const res = await tables.createRow<PayrollEducation>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EDUCATION,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayrollEducation = async (
	id: string,
	payload: Partial<PayrollEducation>,
) => {
	const res = await tables.updateRow<PayrollEducation>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EDUCATION,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayrollEducation = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EDUCATION,
		rowId: id,
	});
};
