import { createSignal, onCleanup, onMount } from "solid-js";

export const useWindowSize = () => {
	const [width, setWidth] = createSignal<number>(0);
	const [height, setHeight] = createSignal<number>(0);

	onMount(() => {
		const update = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};
		update();
		window.addEventListener("resize", update);
		onCleanup(() => window.removeEventListener("resize", update));
	});

	return { width, height };
};
