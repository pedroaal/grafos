import { action, redirect } from "@solidjs/router";
import { account } from "~/lib/appwrite";

export const login = action(async (formData: FormData) => {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await account.createEmailPasswordSession({ email, password });
  throw redirect("/app");
});

export const logout = action(async () => {
  "use server";
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch (error) {
    console.error("[logout] Failed:", error);
  }
  throw redirect("/login");
});