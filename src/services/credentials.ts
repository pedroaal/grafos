import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listCredentials(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CREDENTIALS);
	let docs = res.documents as Credential[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getCredential(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CREDENTIALS, id);
	return res as Credential;
}

export const createCredential(payload: Partial<Credential>) {
	// Expectation: payload.password may be plaintext; Appwrite Function will hash it.
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CREDENTIALS,
		makeId(),
		payload,
	);
	return res as Credential;
}

export const updateCredential(
	id: string,
	payload: Partial<Credential>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.CREDENTIALS,
		id,
		payload,
	);
	return res as Credential;
}

export const deleteCredential(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CREDENTIALS, id);
}
