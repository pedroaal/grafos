import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollEducation } from "~/types/appwrite";

export const listPayrollEducation = async (options: { payrollId?: string }) => {
	const queries = [];
	if (options?.payrollId)
		queries.push(Query.equal("payrollId", options.payrollId));

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

export const syncPayrollEducation = async (
	payrollId: string,
	education: Partial<PayrollEducation>[],
) => {
	const existing = await listPayrollEducation({ payrollId });
	const existingIds = new Set(existing.rows.map((item) => item.$id));
	const incomingIds = new Set(education.filter((e) => e.$id).map((e) => e.$id));

	// Delete items that are no longer in the incoming list
	const toDelete = existing.rows.filter((item) => !incomingIds.has(item.$id));
	await Promise.all(
		toDelete.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.PAYROLL_EDUCATION,
				rowId: item.$id,
			}),
		),
	);

	// Create or update items
	const promises = education.map((edu) => {
		const hasId = edu.$id && existingIds.has(edu.$id);
		if (hasId) {
			// Update existing
			return tables.updateRow<PayrollEducation>({
				databaseId: DATABASE_ID,
				tableId: TABLES.PAYROLL_EDUCATION,
				rowId: edu.$id!,
				data: {
					...edu,
					payrollId,
				} as Partial<PayrollEducation>,
			});
		}
		// Create new
		return tables.createRow<PayrollEducation>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PAYROLL_EDUCATION,
			rowId: makeId(),
			data: {
				payrollId,
				...edu,
			} as PayrollEducation,
		});
	});

	return await Promise.all(promises);
};
