import { Account, Client, Storage, TablesDB } from "appwrite";

const client = new Client();

// Configuration from environment variables
client
	.setEndpoint(
		import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
	)
	.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);

export { client };
