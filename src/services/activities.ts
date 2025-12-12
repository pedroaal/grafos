import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Activities } from "~/types/appwrite";

export const listActivities = async (
	companyId: string,
	options?: {
		canEvaluate?: boolean;
		followUp?: boolean;
	},
) => {
	const res = await tables.listRows<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		queries: [
			Query.equal("deletedAt", false),
			Query.equal("companyId", companyId),
			...(options?.canEvaluate
				? [Query.equal("canEvaluate", options.canEvaluate)]
				: []),
			...(options?.followUp ? [Query.equal("followUp", options.followUp)] : []),
		],
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

/**
 * Creation of templates or activities may require validation. Use server-side control when needed.
 */
export const createActivity = async (payload: Activities) => {
	const res = await tables.createRow<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateActivity = async (payload: Partial<Activities>) => {
	const res = await tables.updateRow<Activities>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ACTIVITIES,
		rowId: makeId(),
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
