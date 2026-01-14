import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Credentials } from "~/types/appwrite";

export const listCredentials = async (tenantId: string) => {
	const res = await tables.listRows<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		queries: [Query.isNull("deletedAt"), Query.equal("tenantId", tenantId)],
	});
	return res;
};

export const getCredential = async (id: string) => {
	const res = await tables.getRow<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: id,
	});
	return res;
};

export const createCredential = async (payload: Credentials) => {
	// Expectation: payload.password may be plaintext; Appwrite Function will hash it.
	const res = await tables.createRow<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateCredential = async (
	id: string,
	payload: Partial<Credentials>,
) => {
	const res = await tables.updateRow<Credentials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteCredential = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CREDENTIALS,
		rowId: id,
	});
};
