import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Modules } from "~/types/appwrite";

export const listModules = async (companyId: string) => {
	const res = await tables.listRows<Modules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
	});
	return res;
};
