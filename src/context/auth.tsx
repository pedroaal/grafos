import { useNavigate } from "@solidjs/router";
import type { Models } from "appwrite";
import { createContext, type ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Routes } from "~/config/routes";
import { account, teams } from "~/lib/appwrite";
import { listProfileFeatures } from "~/services/users/profileFeatures";
import { getUserByAuthId } from "~/services/users/users";
import type { Users } from "~/types/appwrite";
import { useApp } from "./app";

interface IAuthStore {
	session: Models.User<Models.Preferences> | null;
	user: Users | null;
	tenantId: string | null;
	features: string[];
}

interface IAuth {
	authStore: IAuthStore;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	getAuth: () => Promise<void>;
	checkGuest: () => Promise<void>;
	checkProtected: () => Promise<void>;
	checkFeature: (feature: string) => boolean;
}

export const AuthContext = createContext<IAuth>({
	authStore: { session: null, user: null, tenantId: null, features: [] },
	login: async (_email: string, _password: string) => {},
	logout: () => {},
	getAuth: async () => {},
	checkGuest: async () => {},
	checkProtected: async () => {},
	checkFeature: (_feature: string) => false,
});

export const useAuth = () => {
	const {
		authStore,
		login,
		logout,
		getAuth,
		checkProtected,
		checkGuest,
		checkFeature,
	} = useContext(AuthContext);
	return {
		authStore,
		login,
		logout,
		getAuth,
		checkProtected,
		checkGuest,
		checkFeature,
	};
};

export const AuthProvider: ParentComponent = (props) => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const [authStore, setAuthStore] = createStore<IAuthStore>({
		session: null,
		user: null,
		tenantId: null,
		features: [],
	});

	const getAuth = async () => {
		try {
			const session = await account.get();

			const userData = await getUserByAuthId(session.$id);
			const user = userData.rows[0];

			const teamsData = await teams.list();
			const tenantId = teamsData.teams[0]?.$id || null;

			const featuresData = await listProfileFeatures(user?.profileId);
			const features = featuresData.rows.map(
				(item) => item.featureId as string,
			);

			setAuthStore({
				session,
				user,
				tenantId,
				features,
			});

			return;
		} catch {
			setAuthStore({
				session: null,
				user: null,
				tenantId: null,
				features: [],
			});
			nav(Routes.login);
			return;
		}
	};

	const login = async (email: string, password: string) => {
		try {
			await account.createEmailPasswordSession({ email, password });
			addAlert({ type: "success", message: "Inicio de sesión exitoso" });
			nav(Routes.dashboard);
			return;
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al iniciar sesión",
			});
			return;
		}
	};

	const logout = async () => {
		try {
			await account.deleteSession({ sessionId: "current" });
			setAuthStore({
				session: null,
				user: null,
				tenantId: null,
				features: [],
			});
			addAlert({ type: "success", message: "Sesión cerrada" });
			nav(Routes.login);
			return;
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al cerrar sesión",
			});
			return;
		}
	};

	const checkGuest = async () => {
		const session = await account.get();
		if (session) {
			nav(Routes.dashboard);
			return;
		}
		return;
	};

	const checkProtected = async () => {
		const session = await account.get();
		if (!session) {
			nav(Routes.login);
			return;
		}
		await getAuth();
		return;
	};

	const checkFeature = (feature: string) =>
		authStore.features.includes(feature);

	return (
		<AuthContext.Provider
			value={{
				authStore,
				login,
				logout,
				getAuth,
				checkGuest,
				checkProtected,
				checkFeature,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};
