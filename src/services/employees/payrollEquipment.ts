import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollEquipment } from "~/types/appwrite";

/**
 * List payroll equipment with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.payrollId - Filter by payroll ID
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listPayrollEquipment = async (options?: {
	payrollId?: string;
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

	const res = await tables.listRows<PayrollEquipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EQUIPMENT,
		queries,
	});

	return res;
};

export const getPayrollEquipment = async (id: string) => {
	const res = await tables.getRow<PayrollEquipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EQUIPMENT,
		rowId: id,
	});
	return res;
};

export const createPayrollEquipment = async (payload: PayrollEquipment) => {
	const res = await tables.createRow<PayrollEquipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EQUIPMENT,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayrollEquipment = async (
	id: string,
	payload: PayrollEquipment,
) => {
	const res = await tables.updateRow<PayrollEquipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EQUIPMENT,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayrollEquipment = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.PAYROLL_EQUIPMENT,
		rowId: id,
	});
};
