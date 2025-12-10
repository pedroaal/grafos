import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, useContext } from "solid-js";
import { PortalContext } from "~/context/portal";
import { account } from "~/lib/appwrite";

const useAuth = () => {
	const [_store, { addAlert }] = useContext(PortalContext);
	const [user, setUser] = createSignal<any>(null);
	const [loading, setLoading] = createSignal(true);
	const navigate = useNavigate();

	// Check if user is logged in
	createEffect(async () => {
		try {
			const currentUser = await account.get();
			setUser(currentUser);
		} catch (error) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	});

	const login = async (email: string, password: string) => {
		try {
			await account.createEmailPasswordSession(email, password);
			const currentUser = await account.get();
			setUser(currentUser);
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
	};

	const register = async (email: string, password: string, name: string) => {
		try {
			await account.create("unique()", email, password, name);
			await login(email, password);
			return true;
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al registrarse",
			});
			return false;
		}
	};

	const logout = async () => {
		try {
			await account.deleteSession("current");
			setUser(null);
			addAlert({ type: "success", message: "Sesión cerrada" });
			navigate("/");
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al cerrar sesión",
			});
		}
	};

	return {
		user,
		loading,
		login,
		register,
		logout,
	};
};

export default useAuth;
