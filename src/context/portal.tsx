import { createContext, createUniqueId, type ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import type { IAlert } from "~/types/alert";

type PortalStore = {
	alerts: Array<IAlert>;
	loaders: Array<string>;
	showModal: string | null;
};

type PortalActions = {
	addAlert: (alert: Omit<IAlert, "id">) => void;
	removeAlert: (id: string) => void;
	addLoader: () => void;
	removeLoader: (id: string) => void;
	openModal: (id: string) => void;
	closeModal: () => void;
};

export const PortalContext = createContext<[PortalStore, PortalActions]>([
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

export const PortalProvider: ParentComponent = (props) => {
	const [store, setStore] = createStore<PortalStore>({
		alerts: [],
		loaders: [],
		showModal: null,
	});

	const actions: PortalActions = {
		addAlert(alert: Omit<IAlert, "id">) {
			setStore("alerts", (current) => {
				const id = createUniqueId();

				if (alert.autoDismiss !== false) {
					setTimeout(() => {
						actions.removeAlert(id);
					}, 5000);
				}

				return [
					...current,
					{
						id,
						message: alert.message,
						type: alert.type,
						autoDismiss: alert.autoDismiss,
					},
				];
			});
		},
		removeAlert(id: string) {
			setStore("alerts", (current) =>
				current.filter((alert) => alert.id !== id),
			);
		},
		addLoader() {
			const id = createUniqueId();
			setStore("loaders", (current) => [...current, id]);
			return id;
		},
		removeLoader(id: string) {
			setStore("loaders", (current) =>
				current.filter((loader) => loader !== id),
			);
		},
		openModal(id: string) {
			setStore("showModal", id);
		},
		closeModal() {
			setStore("showModal", null);
		},
	};

	return (
		<PortalContext.Provider value={[store, actions]}>
			{props.children}
		</PortalContext.Provider>
	);
};
