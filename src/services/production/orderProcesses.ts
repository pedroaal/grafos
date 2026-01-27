import { Query } from "appwrite";
import type { ProcessForm } from "~/components/production/ProcessesSection";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderProcesses } from "~/types/appwrite";

export const listOrderProcesses = async (options: {
	orderId: string;
	done?: boolean;
}) => {
	const queries = [Query.equal("orderId", options.orderId)];
	if (options?.done !== undefined) {
		queries.push(Query.equal("done", options.done));
	}

	const res = await tables.listRows<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		queries,
	});
	return res;
};

export const syncOrderProcesses = async (
	orderId: string,
	processes: ProcessForm[],
) => {
	const existing = await listOrderProcesses({ orderId });
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.ORDER_PROCESSES,
				rowId: item.$id,
			}),
		),
	);

	// Create new relations
	const promises = processes.map((process) =>
		tables.createRow<OrderProcesses>({
			databaseId: DATABASE_ID,
			tableId: TABLES.ORDER_PROCESSES,
			rowId: makeId(),
			data: {
				orderId,
				...process,
			},
		}),
	);

	return await Promise.all(promises);
};

export const getOrderProcess = async (id: string) => {
	const res = await tables.getRow<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: id,
	});
	return res;
};

export const createOrderProcess = async (payload: OrderProcesses) => {
	const res = await tables.createRow<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateOrderProcess = async (
	id: string,
	payload: Partial<OrderProcesses>,
) => {
	const res = await tables.updateRow<OrderProcesses>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteOrderProcess = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PROCESSES,
		rowId: id,
	});
};
