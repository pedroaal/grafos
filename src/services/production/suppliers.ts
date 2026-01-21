import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Suppliers } from "~/types/appwrite";

export const listSuppliers = async (options?: { search?: string }) => {
	const queries = [];
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
