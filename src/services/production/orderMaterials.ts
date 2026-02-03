import { Query } from "appwrite";
import type { MaterialForm } from "~/components/production/MaterialsSection";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { OrderMaterials } from "~/types/appwrite";

export const listOrderMaterials = async (options: {
	orderId: string;
	supplierId?: string;
	page?: number;
	perPage?: number;
}) => {
	const { page = 1, perPage = 10 } = options;
	const queries = [
		Query.limit(perPage),
		Query.offset((page - 1) * perPage),
		Query.equal("orderId", options.orderId),
	];
	if (options?.supplierId) {
		queries.push(Query.equal("supplierId", options.supplierId));
	}

	const res = await tables.listRows<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		queries,
	});
	return res;
};

export const syncOrderMaterials = async (
	orderId: string,
	materials: MaterialForm[],
) => {
	const existing = await listOrderMaterials({ orderId });
	await Promise.all(
		existing.rows.map((item) =>
			tables.deleteRow({
				databaseId: DATABASE_ID,
				tableId: TABLES.ORDER_MATERIALS,
				rowId: item.$id,
			}),
		),
	);

	// Create new relations
	const promises = materials.map((material) =>
		tables.createRow<OrderMaterials>({
			databaseId: DATABASE_ID,
			tableId: TABLES.ORDER_MATERIALS,
			rowId: makeId(),
			data: {
				orderId,
				...material,
			},
		}),
	);

	return await Promise.all(promises);
};

export const getMaterialRequest = async (id: string) => {
	const res = await tables.getRow<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: id,
	});
	return res;
};

export const createMaterialRequest = async (payload: OrderMaterials) => {
	const res = await tables.createRow<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateMaterialRequest = async (
	id: string,
	payload: Partial<OrderMaterials>,
) => {
	const res = await tables.updateRow<OrderMaterials>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteMaterialRequest = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ORDER_MATERIALS,
		rowId: id,
	});
};
