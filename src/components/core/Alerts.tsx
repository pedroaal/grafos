import { FaSolidX } from "solid-icons/fa";
import { type Component, For, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";

import { PortalContext } from "~/context/portal";
import type { IAlert } from "~/types/alert";

const Alert: Component<IAlert> = (props) => {
	const [_store, { removeAlert }] = useContext(PortalContext);

	const alertClass = () => {
		const baseClass = "alert shadow-lg";
		switch (props.type) {
			case "success":
				return `${baseClass} alert-success`;
			case "error":
				return `${baseClass} alert-error`;
			case "warning":
				return `${baseClass} alert-warning`;
			case "info":
				return `${baseClass} alert-info`;
			default:
				return baseClass;
		}
	};

	return (
		<div class="fixed top-4 right-4 z-50 w-96 max-w-full">
			<div class={alertClass()}>
				<div class="flex items-center justify-between w-full">
					<span>{props.message}</span>
					<button
						class="btn btn-sm btn-ghost"
						type="button"
						onClick={() => removeAlert(props.id)}
					>
						<FaSolidX />
					</button>
				</div>
			</div>
		</div>
	);
};

const Alerts: Component = () => {
	const [store] = useContext(PortalContext);

	return (
		<Portal mount={document.getElementById("alerts")!}>
			<Show when={store.alerts.length}>
				<div class="fixed top-4 right-4 w-92 z-50">
					<div class="flex flex-col gap-3 w-full">
						<For each={store.alerts}>{(alert) => <Alert {...alert} />}</For>
					</div>
				</div>
			</Show>
		</Portal>
	);
};

export default Alerts;
