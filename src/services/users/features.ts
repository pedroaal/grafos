import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { tables } from "~/lib/appwrite";
import type { Features } from "~/types/appwrite";

export const listFeatures = async (options: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Features>({
		databaseId: DATABASE_ID,
		tableId: TABLES.FEATURES,
		queries,
	});
	return res;
};
