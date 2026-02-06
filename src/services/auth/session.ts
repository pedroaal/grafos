import { query, redirect } from "@solidjs/router";
import type { Models } from "appwrite";
import { getRequestEvent } from "solid-js/web";
import { account, teams } from "~/lib/appwrite"; // tu SDK server-side
import type { Users } from "~/types/appwrite";
import { listProfileFeatures } from "../users/profileFeatures";
import { getUserByAuthId } from "../users/users";

interface IAuth {
  session: Models.User<Models.Preferences> | null;
  user: Users | null;
  tenantId: string | null;
  features: string[];
}

export const getSession = query(async (): Promise<IAuth | null> => {
  "use server";

  try {
    const session = await account.get();
    const user = await getUserByAuthId(session.$id);
    const teamsList = await teams.list();
    const tenantId = teamsList.teams[0]?.$id || null;
    const featuresData = await listProfileFeatures({ profileId: user.rows[0]?.profileId as any as string || "" });
    return { session, user: user.rows[0] || null, tenantId: tenantId, features: featuresData.rows.map((item) => item.featureId as any as string) };
  } catch (error) {
    console.error("[getSession] No active session:", error);
    return null;
  }
}, "session");

export const requireAuth = query(async (): Promise<IAuth> => {
  "use server";

  const auth = await getSession();
  if (!auth?.session) {
    throw redirect("/login");
  }
  return auth;
}, "requireAuth");

export const requireGuest = query(async (): Promise<void> => {
  "use server";

  const auth = await getSession();
  if (auth?.session) {
    throw redirect("/app");
  }
}, "requireGuest");
