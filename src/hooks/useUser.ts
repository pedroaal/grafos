import { createAsync } from "@solidjs/router";
import { getSession } from "~/services/auth/session";

export const useUser = () =>
	createAsync(() => getSession(), { deferStream: true });
