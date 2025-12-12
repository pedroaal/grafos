import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listPayrolls(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.PAYROLL);
	let docs = res.documents as Payroll[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getPayroll(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.PAYROLL, id);
	return res as Payroll;
}

export const createPayroll(payload: Partial<Payroll>) {
	// Sensitive: prefer server-side creation (see Notes)
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.PAYROLL,
		makeId(),
		payload,
	);
	return res as Payroll;
}

export const updatePayroll(id: string, payload: Partial<Payroll>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.PAYROLL, id, payload);
	return res as Payroll;
}

export const deletePayroll(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.PAYROLL, id);
}
