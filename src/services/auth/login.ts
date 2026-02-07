import { action, redirect } from "@solidjs/router";
import { account } from "~/lib/appwrite";
import type { LoginForm } from "~/types/login";

export const loginAction = action(async (formData: LoginForm) => {
	try {
		await account.createEmailPasswordSession(formData);
	} catch (error) {
		console.error("[login] Failed:", error);
		throw new Error("Login failed");
	}
	throw redirect("/app");
});

export const logoutAction = action(async () => {
	try {
		await account.deleteSession({ sessionId: "current" });
	} catch (error) {
		console.error("[logout] Failed:", error);
	}
	throw redirect("/login");
});
