import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listPayrollDocuments(payrollId?: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PAYROLL_DOCUMENTS);
	let docs = res.documents as PayrollDocument[];
	if (payrollId) docs = docs.filter((d) => d.payrollId === payrollId);
	return res;
}

export const getPayrollDocument(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PAYROLL_DOCUMENTS, id);
	return res as PayrollDocument;
}

export const createPayrollDocument(payload: Partial<PayrollDocument>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_DOCUMENTS,
		makeId(),
		payload,
	);
	return res as PayrollDocument;
}

export const updatePayrollDocument(
	id: string,
	payload: Partial<PayrollDocument>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.PAYROLL_DOCUMENTS,
		id,
		payload,
	);
	return res as PayrollDocument;
}

export const deletePayrollDocument(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PAYROLL_DOCUMENTS, id);
}
