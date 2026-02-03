import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Notifications } from "~/types/appwrite";

export const listNotifications = async (options: {
	userId?: string;
	unreadOnly?: boolean;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.unreadOnly) queries.push(Query.isNull("readAt"));

	const res = await tables.listRows<Notifications>({
		databaseId: DATABASE_ID,
		tableId: TABLES.NOTIFICATIONS,
		queries,
	});

	return res;
};

export const getNotification = async (id: string) => {
	const res = await tables.getRow<Notifications>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		rowId: id,
	});
	return res;
};

export const createNotification = async (payload: Notifications) => {
	const res = await tables.createRow<Notifications>({
		databaseId: DATABASE_ID,
		tableId: TABLES.NOTIFICATIONS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateNotification = async (
	id: string,
	payload: Notifications,
) => {
	const res = await tables.updateRow<Notifications>({
		databaseId: DATABASE_ID,
		tableId: TABLES.NOTIFICATIONS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteNotification = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.NOTIFICATIONS,
		rowId: id,
	});
};
