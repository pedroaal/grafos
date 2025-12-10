import type { ParentComponent } from "solid-js";

import Footer from "~/components/landing/Footer";
import Nav from "~/components/landing/Nav";

const MainLayout: ParentComponent = (props) => {
	return (
		<div class="flex flex-col min-h-screen bg-base-200">
			<Nav />
			<main class="flex-1 p-6 bg-base-200">{props.children}</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
