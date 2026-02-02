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

type AuthStore = {
	session: Models.User | null;
	user: Users | null;
	tenantId: string | null;
	features: string[];
};

interface IGetAuthOptions {
	navigateOnFail?: boolean;
	navigateOnSuccess?: boolean;
}

type AuthActions = {
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	getAuth: (options: IGetAuthOptions) => Promise<boolean>;
	checkFeature: (feature: string) => boolean;
};

export const AuthContext = createContext<[AuthStore, AuthActions]>([
	{ session: null, user: null, tenantId: null, features: [] },
	{
		login: async () => false,
		logout: () => {},
		getAuth: async () => false,
		checkFeature: () => false,
	},
]);

export const useAuth = () => {
	const [authStore, { login, logout, getAuth, checkFeature }] =
		useContext(AuthContext);
	return { authStore, login, logout, getAuth, checkFeature };
};

export const AuthProvider: ParentComponent = (props) => {
	const navigate = useNavigate();
	const { addAlert } = useApp();
	const [store, setStore] = createStore<AuthStore>({
		session: null,
		user: null,
		tenantId: null,
		features: [],
	});

	const getAuth = async (options: IGetAuthOptions) => {
		try {
			const currentSession = await account.get();
			const currentUser = await getUserByAuthId(currentSession.$id);
			const teamsList = await teams.list();
			const tenantId = teamsList.teams[0]?.$id || null;
			const featuresData = await listProfileFeatures(
				currentUser.rows[0]?.profileId || "",
			);

			setStore({
				session: currentSession,
				user: currentUser.rows[0] || null,
				tenantId: tenantId,
				features: featuresData.rows.map((item) => item.featureId),
			});

			if (options?.navigateOnSuccess) navigate(Routes.dashboard);
			return true;
		} catch {
			setStore("session", null);
			setStore("user", null);
			if (options?.navigateOnFail) navigate(Routes.login);
			return false;
		}
	};

	const login = async (email: string, password: string) => {
		try {
			await account.createEmailPasswordSession({ email, password });
			getAuth({});
			addAlert({ type: "success", message: "Inicio de sesión exitoso" });
			navigate(Routes.dashboard);
			return true;
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al iniciar sesión",
			});
			return false;
		}
	};

	const logout = async () => {
		try {
			await account.deleteSession({ sessionId: "current" });
			setStore("session", null);
			setStore("user", null);
			addAlert({ type: "success", message: "Sesión cerrada" });
			navigate(Routes.home);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al cerrar sesión",
			});
		}
	};

	const checkFeature = (feature: string) => store.features.includes(feature);

	return (
		<AuthContext.Provider
			value={[
				store,
				{
					login,
					logout,
					getAuth,
					checkFeature,
				},
			]}
		>
			{props.children}
		</AuthContext.Provider>
	);
};
