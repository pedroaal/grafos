import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { tables } from "~/lib/appwrite";
import type { Features } from "~/types/appwrite";

export const listFeatures = async () => {
	const res = await tables.listRows<Features>({
		databaseId: DATABASE_ID,
		tableId: TABLES.FEATURES,
		queries: [Query.limit(100)],
	});
	return res;
};
