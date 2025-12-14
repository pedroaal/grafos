import {
	createContext,
	createUniqueId,
	type ParentComponent,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import type { IAlert, IAlertOptions } from "~/types/alert";

type AppStore = {
	alerts: Array<IAlert>;
	loaders: Array<string>;
	showModal: string | null;
};

type AppActions = {
	addAlert: (alert: Omit<IAlert, "id">, options?: IAlertOptions) => void;
	removeAlert: (id: string) => void;
	addLoader: () => void;
	removeLoader: (id: string) => void;
	openModal: (id: string) => void;
	closeModal: () => void;
};

export const AppContext = createContext<[AppStore, AppActions]>([
	{ alerts: [], loaders: [], showModal: null },
	{
		addAlert: () => {},
		removeAlert: () => {},
		addLoader: () => {},
		removeLoader: () => {},
		openModal: () => {},
		closeModal: () => {},
	},
]);

export const useApp = () => {
	const [
		appStore,
		{ addAlert, removeAlert, addLoader, removeLoader, openModal, closeModal },
	] = useContext(AppContext);

	return {
		appStore,
		addAlert,
		removeAlert,
		addLoader,
		removeLoader,
		openModal,
		closeModal,
	};
};

export const AppProvider: ParentComponent = (props) => {
	const [store, setStore] = createStore<AppStore>({
		alerts: [],
		loaders: [],
		showModal: null,
	});

	const timeMap = new Map<string, number>();

	const addAlert = (
		alert: Omit<IAlert, "id">,
		options: IAlertOptions = { dismissible: true, timeout: 5000 },
	) => {
		const id = createUniqueId();

		setStore("alerts", (state) => [
			...state,
			{
				id,
				message: alert.message,
				type: alert.type,
			},
		]);

		if (options.dismissible) {
			const timerId = setTimeout(() => {
				actions.removeAlert(id);
			}, options.timeout);
			timeMap.set(id, timerId);
		}

		return id;
	};

	const removeAlert = (id: string) => {
		const timerId = timeMap.get(id);
		if (timerId) {
			clearTimeout(timerId);
			timeMap.delete(id);
		}

		setStore("alerts", (state) => state.filter((alert) => alert.id !== id));
	};

	const addLoader = () => {
		const id = createUniqueId();
		setStore("loaders", (state) => [...state, id]);
		return id;
	};

	const removeLoader = (id: string) => {
		setStore("loaders", (state) => state.filter((loader) => loader !== id));
	};

	const openModal = (id: string) => {
		setStore("showModal", id);
	};

	const closeModal = () => {
		setStore("showModal", null);
	};

	return (
		<AppContext.Provider
			value={[
				store,
				{
					addAlert,
					removeAlert,
					addLoader,
					removeLoader,
					openModal,
					closeModal,
				},
			]}
		>
			{props.children}
		</AppContext.Provider>
	);
};
