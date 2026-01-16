// TODO: migrate to teams service
// import { DATABASE_ID, TABLES } from "~/config/db";
// import { makeId, tables } from "~/lib/appwrite";
// import type { Teams } from "~/types/appwrite";

// export const listTeams = async () => {
// 	const res = await tables.listRows<Teams>({
// 		databaseId: DATABASE_ID,
// 		tableId: TABLES.TEAMS,
// 	});
// 	return res;
// };

// export const getCompany = async (id: string) => {
// 	const res = await tables.getRow<Teams>({
// 		databaseId: DATABASE_ID,
// 		tableId: TABLES.TEAMS,
// 		rowId: id,
// 	});
// 	return res;
// };

// export const createCompany = async (payload: Teams) => {
// 	const res = await tables.createRow<Teams>({
// 		databaseId: DATABASE_ID,
// 		tableId: TABLES.TEAMS,
// 		rowId: makeId(),
// 		data: payload,
// 	});
// 	return res;
// };

// export const updateCompany = async (
// 	id: string,
// 	payload: Partial<Teams>,
// ) => {
// 	const res = await tables.updateRow<Teams>({
// 		databaseId: DATABASE_ID,
// 		tableId: TABLES.TEAMS,
// 		rowId: id,
// 		data: payload,
// 	});
// 	return res;
// };

// export const deleteCompany = (id: string) => {
// 	return tables.deleteRow({
// 		databaseId: DATABASE_ID,
// 		tableId: TABLES.TEAMS,
// 		rowId: id,
// 	});
// };
