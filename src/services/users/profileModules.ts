import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProfileModules } from "~/types/appwrite";

export const listProfileModules = async (profileId?: string) => {
	const queries = [Query.isNull("deletedAt")];
	if (profileId) queries.push(Query.equal("profileId", profileId));

	const res = await tables.listRows<ProfileModules>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_MODULES,
		queries,
	});
	return res;
};

export const syncProfileModules = async (
	profileId: string,
	modules: Array<{ moduleId: string; roleId: string }>,
) => {
	const existing = await listProfileModules(profileId);
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.PROFILE_MODULES,
				rowId: item.$id,
			}),
		),
	);

	// Create new relations
	const promises = modules.map((mod) =>
		tables.createRow<ProfileModules>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PROFILE_MODULES,
			rowId: makeId(),
			data: {
				profileId: [profileId],
				moduleId: [mod.moduleId],
				roleId: [mod.roleId],
				deletedAt: null,
			},
		}),
	);

	return await Promise.all(promises);
};
