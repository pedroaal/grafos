import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listPayrollReferences(options?: {
	payrollId?: string;
	referenceType?: boolean;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PAYROLL_REFERENCES);
	let docs = res.documents as PayrollReference[];
	if (options?.payrollId)
		docs = docs.filter((d) => d.payrollId === options.payrollId);
	if (typeof options?.referenceType === "boolean")
		docs = docs.filter((d) => d.referenceType === options.referenceType);
	return res;
}

export const getPayrollReference(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PAYROLL_REFERENCES, id);
	return res as PayrollReference;
}

export const createPayrollReference(
	payload: Partial<PayrollReference>,
) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_REFERENCES,
		makeId(),
		payload,
	);
	return res as PayrollReference;
}

export const updatePayrollReference(
	id: string,
	payload: Partial<PayrollReference>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_REFERENCES,
		id,
		payload,
	);
	return res as PayrollReference;
}

export const deletePayrollReference(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PAYROLL_REFERENCES, id);
}
