import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { AccountingBook } from "~/types/appwrite";

export const listComments(options?: {
	companyId: string;
	contactId?: string;
	parentId?: string | null;
}) {
	const res = await tables.listRows<>(DATABASE_ID, TABLES.COMMENTS);
	let docs = res.documents as Comment[];

	if (options?.companyId)
		docs = docs.filter((d) => d.companyId === options.companyId);
	if (options?.contactId)
		docs = docs.filter((d) => d.contactId === options.contactId);
	if (options?.parentId !== undefined)
		docs = docs.filter((d) => (d.parentId ?? null) === options.parentId);

	// order by parentId ASC to group threads (matches parentIdx ASC)
	docs = docs.sort((a, b) =>
		(a.parentId ?? "").localeCompare(b.parentId ?? ""),
	);

	return res;
}

export const getComment(id: string) {
	const res = await tables.getRow<>(DATABASE_ID, TABLES.COMMENTS, id);
	return res as Comment;
}

/**
 * Use server-side moderation if needed. This is a direct create helper.
 */
export const createComment(payload: Partial<Comment>) {
	const res = await tables.createRow<>(
		DATABASE_ID,
		TABLES.COMMENTS,
		makeId(),
		payload,
	);
	return res as Comment;
}

export const updateComment(id: string, payload: Partial<Comment>) {
	const res = await tables.updateRow<>(DATABASE_ID, TABLES.COMMENTS, id, payload);
	return res as Comment;
}

export const deleteComment(id: string) {
	return tables.deleteRow(DATABASE_ID, TABLES.COMMENTS, id);
}
