import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ProfileFeatures } from "~/types/appwrite";

export const listProfileFeatures = async (options: {
	profileId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.profileId) queries.push(Query.equal("profileId", options.profileId));

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
	const existing = await listProfileFeatures({ profileId });
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
