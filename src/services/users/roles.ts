import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Roles } from "~/types/appwrite";

export const listRoles = async () => {
	const res = await tables.listRows<Roles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ROLES,
	});
	return res;
};
