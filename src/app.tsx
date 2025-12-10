import { Meta, MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import type { Component } from "solid-js";
import { Suspense } from "solid-js";

import Alerts from "./components/core/Alerts";
import Loader from "./components/core/Loader";
import { AuthProvider } from "./context/auth";
import { PortalProvider } from "./context/portal";

import "./app.css";

const App: Component = () => {
	injectSpeedInsights();
	inject();

	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<Meta name="author" content="Pedro Altamirano" />
					<Meta name="description" content="Servigraf v3." />
					<Meta property="og:image" content="/favicon.ico" />
					<Meta property="og:image:alt" content="Pedro Altamirano" />
					<Meta property="og:site_name" content="Servigraf" />
					<PortalProvider>
						<AuthProvider>
							<Suspense>{props.children}</Suspense>
							<Alerts />
							<Loader />
						</AuthProvider>
					</PortalProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
};

export default App;
