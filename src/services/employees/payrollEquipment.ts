import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { PayrollEquipment } from "~/types/appwrite";

export const listPayrollEquipment = async (options: { payrollId?: string }) => {
	const queries = [];
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

export const syncPayrollEquipment = async (
	payrollId: string,
	equipment: Partial<PayrollEquipment>[],
) => {
	const existing = await listPayrollEquipment({ payrollId });

	// Delete existing equipment records
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.PAYROLL_EQUIPMENT,
				rowId: item.$id,
			}),
		),
	);

	// Create new equipment records
	const promises = equipment.map((eq) =>
		tables.createRow<PayrollEquipment>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PAYROLL_EQUIPMENT,
			rowId: makeId(),
			data: {
				payrollId,
				...eq,
			} as PayrollEquipment,
		}),
	);

	return await Promise.all(promises);
};
