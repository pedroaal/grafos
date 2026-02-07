import { A, createAsync, useAction } from "@solidjs/router";
import {
	FaSolidBars,
	FaSolidBell,
	FaSolidChevronLeft,
	FaSolidChevronRight,
} from "solid-icons/fa";
import {
	createSignal,
	For,
	Match,
	type ParentComponent,
	Switch,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { Routes } from "~/config/routes";
import { SidebarLinks } from "~/config/sidebar";

import { useWindowSize } from "~/hooks/useWindowSize";
import { logoutAction } from "~/services/auth/login";
import { requireAuth } from "~/services/auth/session";

const Notifications = [
	{
		id: 1,
		message: "No hay notificaciones",
	},
];

const DashboardLayout: ParentComponent = (props) => {
	const auth = createAsync(() => requireAuth(), {
		deferStream: true,
	});
	const logout = useAction(logoutAction);
	const { width } = useWindowSize();
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	const iconsSize = () => (sidebarOpen() ? 16 : 24);

	const checkFeature = (featureId: string) =>
		auth()?.features.includes(featureId);

	return (
		<div class="drawer md:drawer-open h-dvh">
			<input
				id="sidebar-drawer"
				type="checkbox"
				class="drawer-toggle"
				checked={width() >= 1536 ? true : sidebarOpen()}
				onChange={(e) => setSidebarOpen(e.currentTarget.checked)}
			/>

			{/* Sidebar */}
			<div class="drawer-side is-drawer-close:overflow-visible">
				<label
					for="sidebar-drawer"
					aria-label="close sidebar"
					class="drawer-overlay"
				></label>
				<div class="min-h-full bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64 flex flex-col justify-between">
					<ul class="menu w-full gap-2">
						<Switch>
							<Match when={sidebarOpen()}>
								<img src="/logo_blue.svg" alt="logo" class="h-10 mb-4" />
							</Match>
							<Match when={!sidebarOpen()}>
								<img src="/iso_blue.svg" alt="logo min" class="h-10 mb-4" />
							</Match>
						</Switch>
						<For each={SidebarLinks}>
							{(item) => (
								<Switch>
									<Match
										when={
											checkFeature(item.feature) &&
											(!item.children || item.children.length === 0)
										}
									>
										<li>
											<A href={item.href}>
												<Dynamic
													component={item.icon}
													size={iconsSize()}
												></Dynamic>
												<span class="is-drawer-close:hidden">{item.label}</span>
											</A>
										</li>
									</Match>
									<Match
										when={
											checkFeature(item.feature) &&
											item.children &&
											item.children.length > 0
										}
									>
										<div class="dropdown dropdown-right is-drawer-open:hidden">
											<li>
												<button tabindex={0} type="button">
													<Dynamic
														component={item.icon}
														size={iconsSize()}
													></Dynamic>
												</button>
												<ul
													tabindex={0}
													class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
												>
													<For each={item.children}>
														{(child) => (
															<li>
																<A href={child.href}>{child.label}</A>
															</li>
														)}
													</For>
												</ul>
											</li>
										</div>
										<li>
											<details class="is-drawer-close:hidden">
												<summary>
													<Dynamic
														component={item.icon}
														size={iconsSize()}
													></Dynamic>
													<span>{item.label}</span>
												</summary>
												<ul>
													<For each={item.children}>
														{(child) => (
															<li>
																<A href={child.href}>
																	<span>{child.label}</span>
																</A>
															</li>
														)}
													</For>
												</ul>
											</details>
										</li>
									</Match>
								</Switch>
							)}
						</For>
					</ul>
					<ul class="menu w-full items-end 2xl:hidden">
						<li>
							<label for="sidebar-drawer" aria-label="open sidebar">
								<Switch>
									<Match when={!sidebarOpen()}>
										<FaSolidChevronRight size={16} />
									</Match>
									<Match when={sidebarOpen()}>
										<FaSolidChevronLeft size={16} />
									</Match>
								</Switch>
							</label>
						</li>
					</ul>
				</div>
			</div>

			<div class="drawer-content flex flex-col max-h-dvh">
				{/* Navbar */}
				<nav class="navbar bg-base-300 w-full sticky top-0 px-4 py-2">
					<div class="flex-1 flex items-center gap-4">
						<label
							for="sidebar-drawer"
							aria-label="open sidebar"
							class="md:hidden"
						>
							<FaSolidBars size={16} />
						</label>
						<span class="text-lg font-bold">Grafos</span>
					</div>
					<div class="flex gap-2 items-center">
						<div class="dropdown dropdown-end">
							<button
								tabIndex={0}
								type="button"
								class="btn btn-ghost btn-circle"
							>
								<FaSolidBell size={24} />
							</button>
							<ul
								tabIndex={0}
								class="dropdown-content menu mt-2 p-2 shadow bg-base-200 rounded-box w-52"
							>
								<For each={Notifications}>
									{(item) => (
										<li>
											<span>{item.message}</span>
										</li>
									)}
								</For>
							</ul>
						</div>
						<div class="dropdown dropdown-end">
							<button
								tabIndex={0}
								type="button"
								class="btn btn-sm btn-secondary btn-circle avatar"
							>
								<span class="text-xl">
									{auth()?.user?.firstName?.[0]?.toUpperCase() || "U"}
								</span>
							</button>
							<ul
								tabIndex={0}
								class="dropdown-content menu mt-2 p-2 shadow bg-base-200 rounded-box w-52"
							>
								<li>
									<A href={Routes.profile}>Perfil</A>
								</li>
								<li>
									<button type="button" onClick={logout}>
										Cerrar Sesión
									</button>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<main class="flex-1 p-6 overflow-y-auto">
					<div class="flex flex-col gap-4">{props.children}</div>
				</main>

				{/* Footer */}
				<footer class="footer footer-center p-4 bg-base-300 text-base-content">
					<div>
						<p>© 2025 Pedro Altamirano.</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default DashboardLayout;
