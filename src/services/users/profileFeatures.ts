import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProfileFeatures } from "~/types/appwrite";

export const listProfileFeatures = async (profileId?: string) => {
	const queries = [Query.limit(100)];
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
	features: Array<string>,
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
	const promises = features.map((featureId) =>
		tables.createRow<ProfileFeatures>({
			databaseId: DATABASE_ID,
			tableId: TABLES.PROFILE_FEATURES,
			rowId: makeId(),
			data: {
				profileId,
				featureId,
			},
		}),
	);

	return await Promise.all(promises);
};
