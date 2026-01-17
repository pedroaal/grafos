import { DATABASE_ID, TABLES } from "~/config/db";
import { tables } from "~/lib/appwrite";
import type { Modules } from "~/types/appwrite";

export const listModules = async () => {
	const res = await tables.listRows<Modules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.MODULES,
	});
	return res;
};
