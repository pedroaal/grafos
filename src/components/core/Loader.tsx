import { Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { PortalContext } from "~/context/portal";

const Loader = () => {
	const [store] = useContext(PortalContext);

	return (
		<Portal mount={document.getElementById("loader")!}>
			<Show when={store.loaders.length}>
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div class="bg-base-100 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				</div>
			</Show>
		</Portal>
	);
};

export default Loader;
