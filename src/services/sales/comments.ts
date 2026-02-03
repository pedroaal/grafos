import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Comments } from "~/types/appwrite";

export const listComments = async (options: {
	contactId?: string;
	parentId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.contactId)
		queries.push(Query.equal("contactId", options.contactId));
	if (options?.parentId !== undefined)
		queries.push(Query.equal("parentId", options.parentId));

	const res = await tables.listRows<Comments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMMENTS,
		queries,
	});

	return res;
};

export const getComment = async (id: string) => {
	const res = await tables.getRow<Comments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMMENTS,
		rowId: id,
	});
	return res;
};

export const createComment = async (payload: Comments) => {
	const res = await tables.createRow<Comments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMMENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateComment = async (id: string, payload: Partial<Comments>) => {
	const res = await tables.updateRow<Comments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMMENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteComment = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.COMMENTS,
		rowId: id,
	});
};
