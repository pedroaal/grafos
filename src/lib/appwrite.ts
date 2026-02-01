import {
	Account,
	Client,
	ID,
	Permission,
	Role,
	Storage,
	TablesDB,
	Teams,
} from "appwrite";

const ENDPOINT =
	import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";
const DEV_KEY = import.meta.env.VITE_APPWRITE_DEV_KEY || "";

const client = new Client()
	.setEndpoint(ENDPOINT)
	.setProject(PROJECT)
	.setDevKey(DEV_KEY);

export const account = new Account(client);
export const teams = new Teams(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);

export const makeId = () => ID.unique();

export const getPermissions = (tenantId: string) => [
	Permission.read(Role.team(tenantId)),
	Permission.update(Role.team(tenantId, "user")),
	Permission.write(Role.team(tenantId, "admin")),
];
