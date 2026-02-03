import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Suppliers } from "~/types/appwrite";

/**
 * List suppliers with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.search - Filter by name
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listSuppliers = async (options?: {
	search?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options || {};
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
	];
	if (options?.search) queries.push(Query.contains("name", options.search));

	const res = await tables.listRows<Suppliers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SUPPLIERS,
		queries,
	});

	return res;
};

export const getSupplier = async (id: string) => {
	const res = await tables.getRow<Suppliers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SUPPLIERS,
		rowId: id,
	});
	return res;
};

export const createSupplier = async (tenantId: string, payload: Suppliers) => {
	const res = await tables.createRow<Suppliers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SUPPLIERS,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateSupplier = async (
	id: string,
	payload: Partial<Suppliers>,
) => {
	const res = await tables.updateRow<Suppliers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.SUPPLIERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteSupplier = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.SUPPLIERS,
		rowId: id,
	});
};
