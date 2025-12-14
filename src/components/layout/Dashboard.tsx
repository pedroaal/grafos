import { A, useLocation } from "@solidjs/router";
import { FaSolidBars, FaSolidPager } from "solid-icons/fa";
import {
	createRenderEffect,
	createSignal,
	For,
	on,
	type ParentComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { Routes } from "~/config/routes";
import { useAuth } from "~/context/auth";

const DashboardLayout: ParentComponent = (props) => {
	const location = useLocation();
	const { authStore, checkAuth, logout } = useAuth();
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	createRenderEffect(on(() => location.pathname, checkAuth));

	const sidebarLinks = [
		{
			href: Routes.dashboard,
			label: "Dashboard",
			icon: FaSolidPager,
		},
		{
			href: Routes.dashboard,
			label: "Produccion",
			icon: FaSolidPager,
			children: [
				{
					href: Routes.orders,
					label: "Pedidos",
				},
				{
					href: Routes.orders,
					label: "Procesos",
				},
				{
					href: Routes.orders,
					label: "Materiales",
				},
			],
		},
		{
			href: Routes.clients,
			label: "Ventas",
			icon: FaSolidPager,
			children: [
				{
					href: Routes.clients,
					label: "Clientes",
				},
				{
					href: Routes.clients,
					label: "Contactos",
				},
				{
					href: Routes.clients,
					label: "Actividades",
				},
			],
		},
		{
			href: Routes.dashboard,
			label: "RRHH",
			icon: FaSolidPager,
			children: [
				{
					href: Routes.dashboard,
					label: "Nómina",
					icon: FaSolidPager,
				},
				{
					href: Routes.dashboard,
					label: "Asistencia",
					icon: FaSolidPager,
				},
			],
		},
		{
			href: Routes.dashboard,
			label: "Usuarios",
			icon: FaSolidPager,
			children: [
				{
					href: Routes.dashboard,
					label: "Perfiles",
				},
			],
		},
		{
			href: Routes.dashboard,
			label: "Sistema",
			icon: FaSolidPager,
			children: [
				{
					href: Routes.dashboard,
					label: "Credenciales",
				},
			],
		},
	];

	return (
		<div class="drawer md:drawer-open">
			<input
				id="sidebar-drawer"
				type="checkbox"
				class="drawer-toggle"
				checked={sidebarOpen()}
				onChange={(e) => setSidebarOpen(e.currentTarget.checked)}
			/>
			<div class="drawer-content flex flex-col">
				{/* Navbar */}
				<nav class="navbar bg-base-300 w-full">
					<label
						for="sidebar-drawer"
						aria-label="open sidebar"
						class="btn btn-square btn-ghost"
					>
						<FaSolidBars size={24} />
					</label>
					<div class="flex-1 px-2 mx-2">
						<span class="text-lg font-bold">Grafos</span>
					</div>
					<div class="flex-none">
						<div class="dropdown dropdown-end">
							<label tabIndex={0} class="btn btn-ghost btn-circle avatar">
								<div class="w-10 rounded-full bg-neutral text-neutral-content">
									<span class="text-xl">
										{authStore.user?.name?.[0]?.toUpperCase() || "U"}
									</span>
								</div>
							</label>
							<ul
								tabIndex={0}
								class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<a>Perfil</a>
								</li>
								<li>
									<a>Configuración</a>
								</li>
								<li>
									<a onClick={logout}>Cerrar Sesión</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<main class="flex-1 p-6">{props.children}</main>
			</div>

			{/* Sidebar */}
			<div class="drawer-side is-drawer-close:overflow-visible">
				<label
					for="sidebar-drawer"
					aria-label="close sidebar"
					class="drawer-overlay"
				></label>
				<div class="min-h-full bg-base-200 is-drawer-close:w-fit is-drawer-open:w-64 gap-2">
					<ul class="menu p-4 w-full">
						<For each={sidebarLinks}>
							{(item) => (
								<li>
									<A
										href={item.href}
										class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
									>
										<Dynamic component={item.icon} size={24}></Dynamic>
										<span class="is-drawer-close:hidden">{item.label}</span>
									</A>
								</li>
							)}
						</For>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default DashboardLayout;
