import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listEquipment(companyId: string) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.EQUIPMENT);
	let docs = res.documents as Equipment[];
	if (companyId) docs = docs.filter((d) => d.companyId === companyId);
	return res;
}

export const getEquipment(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.EQUIPMENT, id);
	return res as Equipment;
}

export const createEquipment(payload: Partial<Equipment>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.EQUIPMENT,
		makeId(),
		payload,
	);
	return res as Equipment;
}

export const updateEquipment(id: string, payload: Partial<Equipment>) {
	const res = await tables.updateRow<>(
		DATABASE_ID,
		TABLES.EQUIPMENT,
		id,
		payload,
	);
	return res as Equipment;
}

export const deleteEquipment(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.EQUIPMENT, id);
}
