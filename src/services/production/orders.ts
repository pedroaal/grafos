import { Query } from "appwrite";
import { OrdersStatus } from "~/config/appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { getPermissions, makeId, tables } from "~/lib/appwrite";
import type { Orders } from "~/types/appwrite";
import { listOrderInks } from "./orderInks";
import { listOrderMaterials } from "./orderMaterials";
import { listOrderProcesses } from "./orderProcesses";

export const listOrders = async (options: {
	orderNumber?: number;
	userId?: string;
	clientId?: string;
	status?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
		Query.select(["*", "clientId.companyId.name", "processes.$id"]),
	];
	if (options?.orderNumber)
		queries.push(Query.equal("number", options.orderNumber));
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.clientId)
		queries.push(Query.equal("clientId", options.clientId));
	if (options?.status) queries.push(Query.equal("status", options.status));
	if (options?.dateFrom)
		queries.push(Query.greaterThan("startDate", options.dateFrom));
	if (options?.dateTo) queries.push(Query.lessThan("endDate", options.dateTo));

	const res = await tables.listRows<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		queries,
	});

	return res;
};

export const getOrder = async (id: string) => {
	const res = await tables.getRow<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: id,
		queries: [
			Query.select([
				"*",
				"clientId.contactId.phone",
				"clientId.contactId.mobile",
			]),
		],
	});
	return res;
};

export const getOrderNumber = async () => {
	const res = await tables.listRows<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		queries: [Query.orderDesc("number"), Query.limit(1)],
	});
	return res.rows[0]?.number || null;
};

export const createOrder = async (tenantId: string, payload: Orders) => {
	const res = await tables.createRow<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: makeId(),
		data: payload,
		permissions: getPermissions(tenantId),
	});
	return res;
};

export const updateOrder = async (id: string, payload: Partial<Orders>) => {
	const res = await tables.updateRow<Orders>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteOrder = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDERS,
		rowId: id,
	});
};

export const duplicateOrder = async (
	orderId: string,
	tenantId: string,
): Promise<Orders> => {
	// Get the original order
	const originalOrder = await getOrder(orderId);

	// Get the next order number
	const lastOrderNumber = await getOrderNumber();
	const newOrderNumber = lastOrderNumber ? lastOrderNumber + 1 : 1;

	// Prepare new order data (excluding Appwrite metadata and processes array)
	const {
		$id: _id,
		$createdAt: _createdAt,
		$updatedAt: _updatedAt,
		$permissions: _permissions,
		$databaseId: _databaseId,
		$sequence: _sequence,
		$tableId: _tableId,
		processes: _processes,
		number: _number,
		status: _status,
		paymentAmount: _paymentAmount,
		balance: _balance,
		...orderData
	} = originalOrder;

	// Create new order with reset values
	const newOrder = await createOrder(tenantId, {
		...orderData,
		number: newOrderNumber,
		status: OrdersStatus.PENDING,
		paymentAmount: 0,
		balance: orderData.orderTotal,
	} as Orders);

	// Duplicate order materials
	const materials = await listOrderMaterials({ orderId });
	await Promise.all(
		materials.rows.map((material) => {
			const {
				$id: _id,
				$createdAt: _createdAt,
				$updatedAt: _updatedAt,
				$permissions: _permissions,
				$databaseId: _databaseId,
				$sequence: _sequence,
				$tableId: _tableId,
				orderId: _orderId,
				...materialData
			} = material;
			return tables.createRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.ORDER_MATERIALS,
				rowId: makeId(),
				data: {
					orderId: newOrder.$id,
					...materialData,
				},
			});
		}),
	);

	// Duplicate order processes
	const orderProcesses = await listOrderProcesses({ orderId });
	await Promise.all(
		orderProcesses.rows.map((process) => {
			const {
				$id: _id,
				$createdAt: _createdAt,
				$updatedAt: _updatedAt,
				$permissions: _permissions,
				$databaseId: _databaseId,
				$sequence: _sequence,
				$tableId: _tableId,
				orderId: _orderId,
				done: _done,
				...processData
			} = process;
			return tables.createRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.ORDER_PROCESSES,
				rowId: makeId(),
				data: {
					orderId: newOrder.$id,
					done: false,
					...processData,
				},
			});
		}),
	);

	// Duplicate order payments (commented out - typically you don't want to duplicate payments)
	// const payments = await listOrderPayments({ orderId });
	// await Promise.all(
	// 	payments.rows.map((payment) => {
	// 		const {
	// 			$id: _id,
	// 			$createdAt: _createdAt,
	// 			$updatedAt: _updatedAt,
	// 			$permissions: _permissions,
	// 			$databaseId: _databaseId,
	// 			$sequence: _sequence,
	// 			$tableId: _tableId,
	// 			orderId: _orderId,
	// 			...paymentData
	// 		} = payment;
	// 		return tables.createRow({
	// 			databaseId: DATABASE_ID,
	// 			tableId: TABLES.ORDER_PAYMENTS,
	// 			rowId: makeId(),
	// 			data: {
	// 				orderId: newOrder.$id,
	// 				...paymentData,
	// 			},
	// 		});
	// 	})
	// );

	// Duplicate order inks
	const inks = await listOrderInks({ orderId });
	await Promise.all(
		inks.rows.map((ink) => {
			const {
				$id: _id,
				$createdAt: _createdAt,
				$updatedAt: _updatedAt,
				$permissions: _permissions,
				$databaseId: _databaseId,
				$sequence: _sequence,
				$tableId: _tableId,
				orderId: _orderId,
				...inkData
			} = ink;
			return tables.createRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.ORDER_INKS,
				rowId: makeId(),
				data: {
					orderId: newOrder.$id,
					...inkData,
				},
			});
		}),
	);

	return newOrder;
};
