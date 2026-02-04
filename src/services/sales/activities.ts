import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Activities } from "~/types/appwrite";

export const listActivities = async (options: {
	canEvaluate?: boolean;
	followUp?: boolean;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [Query.limit(perPage), Query.offset((page - 1) * perPage)];
	if (options?.canEvaluate)
		queries.push(Query.equal("canEvaluate", options.canEvaluate));
	if (options?.followUp)
		queries.push(Query.equal("followUp", options.followUp));

	const res = await tables.listRows<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		queries,
	});
	return res;
};

export const getActivity = async (id: string) => {
	const res = await tables.getRow<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		rowId: id,
	});
	return res;
};

export const createActivity = async (payload: Activities) => {
	const res = await tables.createRow<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateActivity = async (
	id: string,
	payload: Partial<Activities>,
) => {
	const res = await tables.updateRow<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteActivity = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		rowId: id,
	});
};
