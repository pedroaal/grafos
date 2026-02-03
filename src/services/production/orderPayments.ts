import { Query } from "appwrite";
import type { PaymentForm } from "~/components/production/PaymentsSection";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderPayments } from "~/types/appwrite";

/**
 * List order payments with optional filters and pagination
 * @param options - Filter and pagination options
 * @param options.orderId - Filter by order ID (required)
 * @param options.userId - Filter by user ID
 * @param options.dateFrom - Filter by date from
 * @param options.dateTo - Filter by date to
 * @param options.page - Page number (1-indexed). Default: 1
 * @param options.perPage - Items per page. Default: 10
 */
export const listOrderPayments = async (options: {
	orderId: string;
	userId?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
		Query.equal("orderId", options.orderId),
	];
	if (options?.userId) {
		queries.push(Query.equal("userId", options.userId));
	}
	if (options?.dateFrom) {
		queries.push(Query.greaterThan("date", options.dateFrom));
	}
	if (options?.dateTo) {
		queries.push(Query.lessThan("date", options.dateTo));
	}

	const res = await tables.listRows<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		queries,
	});

	return res;
};

export const syncOrderPayments = async (
	orderId: string,
	payments: PaymentForm[],
) => {
	const existing = await listOrderPayments({ orderId });
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.ORDER_PAYMENTS,
				rowId: item.$id,
			}),
		),
	);

	// Create new relations
	const promises = payments.map((payment) =>
		tables.createRow<OrderPayments>({
			databaseId: DATABASE_ID,
			tableId: TABLES.ORDER_PAYMENTS,
			rowId: makeId(),
			data: {
				orderId,
				...payment,
			},
		}),
	);

	return await Promise.all(promises);
};

export const getPayment = async (id: string) => {
	const res = await tables.getRow<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: id,
	});
	return res;
};

export const createPayment = async (payload: OrderPayments) => {
	const res = await tables.createRow<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updatePayment = async (
	id: string,
	payload: Partial<OrderPayments>,
) => {
	const res = await tables.updateRow<OrderPayments>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deletePayment = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_PAYMENTS,
		rowId: id,
	});
};
