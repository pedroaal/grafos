import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listNotifications(options?: {
	companyId: string;
	userId?: string;
	unreadOnly?: boolean;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.NOTIFICATIONS);
	let docs = res.documents as Notification[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.userId) docs = docs.filter((d) => d.userId === options.userId);
	if (options?.unreadOnly) docs = docs.filter((d) => !d.readAt);

	// newest first
	docs = docs.sort((a, b) =>
		(b.$createdAt ?? "").localeCompare(a.$createdAt ?? ""),
	);

	return res;
}

export const getNotification(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.NOTIFICATIONS, id);
	return res as Notification;
}

/**
 * Prefer server-side route or Appwrite Function for create/update of notifications.
 */
export const createNotification(payload: Partial<Notification>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.NOTIFICATIONS,
		makeId(),
		payload,
	);
	return res as Notification;
}

export const updateNotification(
	id: string,
	payload: Partial<Notification>,
) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.NOTIFICATIONS,
		id,
		payload,
	);
	return res as Notification;
}

export const deleteNotification(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.NOTIFICATIONS, id);
}
