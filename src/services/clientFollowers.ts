import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listClientFollowers(options?: {
	userId?: string;
	clientId?: string;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.CLIENT_FOLLOWERS);
	let docs = res.documents as ClientFollower[];

	if (options?.userId) docs = docs.filter((d) => d.userId === options.userId);
	if (options?.clientId)
		docs = docs.filter((d) => d.clientId === options.clientId);

	return res;
}

export const getClientFollower(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.CLIENT_FOLLOWERS, id);
	return res as ClientFollower;
}

export const createClientFollower(payload: Partial<ClientFollower>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.CLIENT_FOLLOWERS,
		makeId(),
		payload,
	);
	return res as ClientFollower;
}

export const updateClientFollower(
	id: string,
	payload: Partial<ClientFollower>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.CLIENT_FOLLOWERS,
		id,
		payload,
	);
	return res as ClientFollower;
}

export const deleteClientFollower(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.CLIENT_FOLLOWERS, id);
}
