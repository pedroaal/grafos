import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Equipment } from "~/types/appwrite";

export const listEquipment = async (companyId: string) => {
	const res = await tables.listRows<Equipment>({
		databaseId: DATABASE_ID,
		tableId: TABLES.EQUIPMENT,
		queries: [Query.isNull("deletedAt"), Query.equal("companyId", companyId)],
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
