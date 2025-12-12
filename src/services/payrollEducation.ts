import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listPayrollEducation(payrollId?: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PAYROLL_EDUCATION);
	let docs = res.documents as PayrollEducation[];
	if (payrollId) docs = docs.filter((d) => d.payrollId === payrollId);
	return res;
}

export const getPayrollEducation(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PAYROLL_EDUCATION, id);
	return res as PayrollEducation;
}

export const createPayrollEducation(
	payload: Partial<PayrollEducation>,
) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_EDUCATION,
		makeId(),
		payload,
	);
	return res as PayrollEducation;
}

export const updatePayrollEducation(
	id: string,
	payload: Partial<PayrollEducation>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_EDUCATION,
		id,
		payload,
	);
	return res as PayrollEducation;
}

export const deletePayrollEducation(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PAYROLL_EDUCATION, id);
}
