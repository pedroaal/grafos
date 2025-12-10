import { useNavigate } from "@solidjs/router";
import { createContext, type ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { account } from "~/lib/appwrite";
import { PortalContext } from "./portal";

type AuthStore = {
	user: any;
};

type AuthActions = {
	checkAuth: () => void;
	login: (email: string, password: string) => void;
	logout: () => void;
};

export const AuthContext = createContext<[AuthStore, AuthActions]>([
	{ user: null },
	{
		login: () => {},
		logout: () => {},
		checkAuth: () => {},
	},
]);

export const AuthProvider: ParentComponent = (props) => {
	const navigate = useNavigate();
	const [_store, { addAlert }] = useContext(PortalContext);
	const [store, setStore] = createStore<AuthStore>({
		user: null,
	});

	const actions: AuthActions = {
		async login(email: string, password: string) {
			try {
				await account.createEmailPasswordSession({ email, password });
				const currentUser = await account.get();
				setStore("user", currentUser);
				addAlert({ type: "success", message: "Inicio de sesión exitoso" });
				navigate("/dashboard");
				return true;
			} catch (error: any) {
				addAlert({
					type: "error",
					message: error.message || "Error al iniciar sesión",
				});
				return false;
			}
		},
		async logout() {
			try {
				await account.deleteSession({ sessionId: "current" });
				setStore("user", null);
				addAlert({ type: "success", message: "Sesión cerrada" });
				navigate("/");
			} catch (error: any) {
				addAlert({
					type: "error",
					message: error.message || "Error al cerrar sesión",
				});
			}
		},
		async checkAuth() {
			if (store.user) {
				return;
			}

			try {
				const currentUser = await account.get();
				setStore("user", currentUser);
			} catch (error) {
				setStore("user", null);
				navigate("/");
			}
		},
	};

	return (
		<AuthContext.Provider value={[store, actions]}>
			{props.children}
		</AuthContext.Provider>
	);
};
