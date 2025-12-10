import { A } from "@solidjs/router";
import { FaSolidBars } from "solid-icons/fa";
import { createSignal, type ParentComponent } from "solid-js";
import useAuth from "~/lib/auth";

const DashboardLayout: ParentComponent = (props) => {
	const { user, logout } = useAuth();
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	return (
		<div class="drawer lg:drawer-open">
			<input
				id="sidebar-drawer"
				type="checkbox"
				class="drawer-toggle"
				checked={sidebarOpen()}
				onChange={(e) => setSidebarOpen(e.currentTarget.checked)}
			/>
			<div class="drawer-content flex flex-col">
				{/* Navbar */}
				<div class="navbar bg-base-300 w-full">
					<div class="flex-none lg:hidden">
						<label for="sidebar-drawer" class="btn btn-square btn-ghost">
							<FaSolidBars />
						</label>
					</div>
					<div class="flex-1 px-2 mx-2">
						<span class="text-lg font-bold">ServiGraf</span>
					</div>
					<div class="flex-none">
						<div class="dropdown dropdown-end">
							<label tabIndex={0} class="btn btn-ghost btn-circle avatar">
								<div class="w-10 rounded-full bg-neutral text-neutral-content">
									<span class="text-xl">
										{user()?.name?.[0]?.toUpperCase() || "U"}
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
				</div>

				{/* Page content */}
				<main class="flex-1 p-6 bg-base-200">{props.children}</main>
			</div>

			{/* Sidebar */}
			<div class="drawer-side">
				<label for="sidebar-drawer" class="drawer-overlay" />
				<aside class="bg-base-100 w-80 min-h-full">
					<div class="py-4 px-6">
						<h2 class="text-2xl font-bold">Menú</h2>
					</div>
					<ul class="menu p-4 w-full">
						<li>
							<A href="/dashboard" activeClass="active">
								Dashboard
							</A>
						</li>

						<li class="menu-title">
							<span>Producción</span>
						</li>
						<li>
							<A href="/dashboard/produccion/pedidos">Pedidos</A>
						</li>
						<li>
							<A href="/dashboard/produccion/procesos">Procesos</A>
						</li>
						<li>
							<A href="/dashboard/produccion/materiales">Materiales</A>
						</li>

						<li class="menu-title">
							<span>CRM / Ventas</span>
						</li>
						<li>
							<A href="/dashboard/ventas/clientes">Clientes</A>
						</li>
						<li>
							<A href="/dashboard/ventas/contactos">Contactos</A>
						</li>
						<li>
							<A href="/dashboard/ventas/actividades">Actividades</A>
						</li>

						<li class="menu-title">
							<span>RRHH</span>
						</li>
						<li>
							<A href="/dashboard/rrhh/nomina">Nómina</A>
						</li>
						<li>
							<A href="/dashboard/rrhh/asistencia">Asistencia</A>
						</li>

						<li class="menu-title">
							<span>Sistema</span>
						</li>
						<li>
							<A href="/dashboard/sistema/usuarios">Usuarios</A>
						</li>
						<li>
							<A href="/dashboard/sistema/perfiles">Perfiles</A>
						</li>
					</ul>
				</aside>
			</div>
		</div>
	);
};

export default DashboardLayout;
