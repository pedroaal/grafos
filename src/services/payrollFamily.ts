import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listPayrollFamily(payrollId?: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PAYROLL_FAMILY);
	let docs = res.documents as PayrollFamily[];
	if (payrollId) docs = docs.filter((d) => d.payrollId === payrollId);
	return res;
}

export const getPayrollFamily(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PAYROLL_FAMILY, id);
	return res as PayrollFamily;
}

export const createPayrollFamily(payload: Partial<PayrollFamily>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_FAMILY,
		makeId(),
		payload,
	);
	return res as PayrollFamily;
}

export const updatePayrollFamily(
	id: string,
	payload: Partial<PayrollFamily>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_FAMILY,
		id,
		payload,
	);
	return res as PayrollFamily;
}

export const deletePayrollFamily(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PAYROLL_FAMILY, id);
}
