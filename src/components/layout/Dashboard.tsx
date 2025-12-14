import { A, useLocation } from "@solidjs/router";
import {
	FaSolidBell,
	FaSolidChevronLeft,
	FaSolidChevronRight,
} from "solid-icons/fa";
import {
	createRenderEffect,
	createSignal,
	For,
	Match,
	on,
	type ParentComponent,
	Switch,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { Routes } from "~/config/routes";
import { SidebarLinks } from "~/config/sidebar";
import { useAuth } from "~/context/auth";

const Notifications = [
	{
		id: 1,
		message: "No hay notificaciones",
	},
];

const DashboardLayout: ParentComponent = (props) => {
	const location = useLocation();
	const { authStore, checkAuth, logout } = useAuth();
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	createRenderEffect(on(() => location.pathname, checkAuth));

	return (
		<div class="drawer md:drawer-open">
			<input
				id="sidebar-drawer"
				type="checkbox"
				class="drawer-toggle"
				checked={sidebarOpen()}
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
					<ul class="menu w-full">
						<Switch>
							<Match when={sidebarOpen()}>
								<img src="/logo" alt="logo" class="mb-4" />
							</Match>
							<Match when={!sidebarOpen()}>
								<img src="/logo-min" alt="logo min" class="mb-4" />
							</Match>
						</Switch>
						<For each={SidebarLinks}>
							{(item) => (
								<li>
									<Switch>
										<Match when={!item.children || item.children.length === 0}>
											<A href={item.href}>
												<Dynamic component={item.icon} size={24}></Dynamic>
												<span class="is-drawer-close:hidden">{item.label}</span>
											</A>
										</Match>
										<Match when={item.children && item.children.length > 0}>
											<div class="dropdown dropdown-right is-drawer-open:hidden">
												<button tabindex={0} type="button">
													<Dynamic component={item.icon} size={24}></Dynamic>
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
											</div>
											<details class="is-drawer-close:hidden">
												<summary>
													<Dynamic component={item.icon} size={24}></Dynamic>
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
										</Match>
									</Switch>
								</li>
							)}
						</For>
					</ul>
					<ul class="menu w-full items-end">
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

			<div class="drawer-content flex flex-col">
				{/* Navbar */}
				<nav class="navbar bg-base-300 w-full sticky top-0 px-4 py-2">
					<div class="flex-1">
						<span class="text-lg font-bold">Grafos</span>
					</div>
					<div class="flex gap-4 items-center">
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
								class="btn btn-secondary btn-circle avatar"
							>
								<span class="text-xl">
									{authStore.session?.name?.[0]?.toUpperCase() || "U"}
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

				<main class="flex-1 p-6 space-y-6">{props.children}</main>

				{/* Footer */}
				<footer class="footer footer-center p-4 bg-base-300 text-base-content">
					<div>
						<p>© 2025 Pedro Altamirano. All rights reserved.</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default DashboardLayout;
