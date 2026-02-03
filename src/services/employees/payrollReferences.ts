import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollReferences } from "~/types/appwrite";

/**
 * List payroll references with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.payrollId - Filter by payroll ID
 * @param options.referenceType - Filter by reference type
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listPayrollReferences = async (options?: {
	payrollId?: string;
	referenceType?: boolean;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.payrollId)
		queries.push(Query.equal("payrollId", options.payrollId));
	if (options?.referenceType !== undefined)
		queries.push(Query.equal("referenceType", options.referenceType));

	const res = await tables.listRows<PayrollReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_REFERENCES,
		queries,
	});
	return res;
};

export const getPayrollReference = async (id: string) => {
	const res = await tables.getRow<PayrollReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_REFERENCES,
		rowId: id,
	});
	return res;
};

export const createPayrollReference = async (payload: PayrollReferences) => {
	const res = await tables.createRow<PayrollReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_REFERENCES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayrollReference = async (
	id: string,
	payload: Partial<PayrollReferences>,
) => {
	const res = await tables.updateRow<PayrollReferences>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_REFERENCES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayrollReference = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_REFERENCES,
		rowId: id,
	});
};
