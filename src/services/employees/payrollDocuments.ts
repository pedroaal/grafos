import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollDocuments } from "~/types/appwrite";

/**
 * List payroll documents with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.payrollId - Filter by payroll ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listPayrollDocuments = async (options?: {
	payrollId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.payrollId) queries.push(Query.equal("payrollId", options.payrollId));

	const res = await tables.listRows<PayrollDocuments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_DOCUMENTS,
		queries,
	});
	return res;
};

export const getPayrollDocument = async (id: string) => {
	const res = await tables.getRow<PayrollDocuments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_DOCUMENTS,
		rowId: id,
	});
	return res;
};

export const createPayrollDocument = async (payload: PayrollDocuments) => {
	const res = await tables.createRow<PayrollDocuments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_DOCUMENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayrollDocument = async (
	id: string,
	payload: Partial<PayrollDocuments>,
) => {
	const res = await tables.updateRow<PayrollDocuments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_DOCUMENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayrollDocument = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_DOCUMENTS,
		rowId: id,
	});
};
