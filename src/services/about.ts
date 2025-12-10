import { query } from "@solidjs/router";
import { APPWRITE_DATABASE } from "~/config/db";
import { tables } from "~/lib/appwrite";
import type { About } from "~/types/appwrite";

export const getAbout = query(async () => {
	try {
		const result = await tables.listRows<About>({
			databaseId: APPWRITE_DATABASE,
			tableId: "about",
		});
		return result.rows[0];
	} catch (e) {
		console.log(e);
	}
}, "about");
