import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Equipment } from "~/types/appwrite";

/**
 * List equipment with optional pagination
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listEquipment = async (options?: {
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];

	const res = await tables.listRows<Equipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.EQUIPMENT,
		queries,
	});
	return res;
};

export const getEquipment = async (id: string) => {
	const res = await tables.getRow<Equipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.EQUIPMENT,
		rowId: id,
	});
	return res;
};

export const createEquipment = async (payload: Equipment) => {
	const res = await tables.createRow<Equipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.EQUIPMENT,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateEquipment = async (
	id: string,
	payload: Partial<Equipment>,
) => {
	const res = await tables.updateRow<Equipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.EQUIPMENT,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteEquipment = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.EQUIPMENT,
		rowId: id,
	});
};
