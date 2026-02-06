import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollReferences } from "~/types/appwrite";

export const listPayrollReferences = async (options: {
	payrollId?: string;
	referenceType?: boolean;
}) => {
	const queries = [];
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

export const syncPayrollReferences = async (
	payrollId: string,
	references: Partial<PayrollReferences>[],
) => {
	const existing = await listPayrollReferences({ payrollId });
	const existingIds = new Set(existing.rows.map((item) => item.$id));
	const incomingIds = new Set(
		references.filter((r) => r.$id).map((r) => r.$id),
	);

	// Delete items that are no longer in the incoming list
	const toDelete = existing.rows.filter((item) => !incomingIds.has(item.$id));
	await Promise.all(
		toDelete.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.PAYROLL_REFERENCES,
				rowId: item.$id,
			}),
		),
	);

	// Create or update items
	const promises = references.map((ref) => {
		const hasId = ref.$id && existingIds.has(ref.$id);
		if (hasId) {
			// Update existing
			return tables.updateRow<PayrollReferences>({
				databaseId: DATABASE_ID,
				tableId: TABLES.PAYROLL_REFERENCES,
				rowId: ref.$id!,
				data: {
					...ref,
					payrollId,
				} as Partial<PayrollReferences>,
			});
		}
		// Create new
		return tables.createRow<PayrollReferences>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PAYROLL_REFERENCES,
			rowId: makeId(),
			data: {
				payrollId,
				...ref,
			} as PayrollReferences,
		});
	});

	return await Promise.all(promises);
};
