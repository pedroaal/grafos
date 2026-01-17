import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProfileFeatures } from "~/types/appwrite";

export const listProfileFeatures = async (profileId?: string) => {
	const queries = [];
	if (profileId) queries.push(Query.equal("profileId", profileId));

	const res = await tables.listRows<ProfileFeatures>({
		databaseId: DATABASE_ID,
		tableId: TABLES.PROFILE_FEATURES,
		queries,
	});
	return res;
};

export const syncProfileFeatures = async (
	profileId: string,
	modules: Array<{ moduleId: string; roleId: string }>,
) => {
	const existing = await listProfileFeatures(profileId);
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.PROFILE_FEATURES,
				rowId: item.$id,
			}),
		),
	);

	// Create new relations
	const promises = modules.map((mod) =>
		tables.createRow<ProfileFeatures>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PROFILE_FEATURES,
			rowId: makeId(),
			data: {
				profileId,
				moduleId: mod.moduleId,
			},
		}),
	);

	return await Promise.all(promises);
};
