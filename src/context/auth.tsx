import { useNavigate } from "@solidjs/router";
import type { Models } from "appwrite";
import { createContext, type ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Routes } from "~/config/routes";
import { account } from "~/lib/appwrite";
import { getUserByAuthId } from "~/services/users/users";
import type { Users } from "~/types/appwrite";
import { useApp } from "./app";

type AuthStore = {
	session: Models.User | null;
	user: Users | null;
};

interface IGetAuthOptions {
	navigateOnFail?: boolean;
	navigateOnSuccess?: boolean;
}

type AuthActions = {
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	getAuth: (options: IGetAuthOptions) => Promise<boolean>;
};

export const AuthContext = createContext<[AuthStore, AuthActions]>([
	{ session: null, user: null },
	{
		login: async () => false,
		logout: () => {},
		getAuth: async () => false,
	},
]);

export const useAuth = () => {
	const [authStore, { login, logout, getAuth }] = useContext(AuthContext);
	return { authStore, login, logout, getAuth };
};

export const AuthProvider: ParentComponent = (props) => {
	const navigate = useNavigate();
	const { addAlert } = useApp();
	const [store, setStore] = createStore<AuthStore>({
		session: null,
		user: null,
	});

	const getAuth = async (options: IGetAuthOptions) => {
		try {
			const currentSession = await account.get();
			debugger;
			const currentUser = await getUserByAuthId(currentSession.$id);
			setStore("session", currentSession);
			setStore("user", currentUser.rows[0] || null);
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

	return (
		<AuthContext.Provider
			value={[
				store,
				{
					login,
					logout,
					getAuth,
				},
			]}
		>
			{props.children}
		</AuthContext.Provider>
	);
};
