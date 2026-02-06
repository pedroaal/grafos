import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollDocuments } from "~/types/appwrite";

export const listPayrollDocuments = async (options: { payrollId?: string }) => {
	const queries = [];
	if (options?.payrollId)
		queries.push(Query.equal("payrollId", options.payrollId));

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

export const syncPayrollDocuments = async (
	payrollId: string,
	document: Partial<PayrollDocuments>,
) => {
	const existing = await listPayrollDocuments({ payrollId });

	// Delete existing document
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.PAYROLL_DOCUMENTS,
				rowId: item.$id,
			}),
		),
	);

	// Create new document
	if (Object.keys(document).length > 0) {
		return await tables.createRow<PayrollDocuments>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PAYROLL_DOCUMENTS,
			rowId: makeId(),
			data: {
				payrollId,
				...document,
			} as PayrollDocuments,
		});
	}
};
