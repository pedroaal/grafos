import { A, useLocation } from "@solidjs/router";
import { FaSolidBars } from "solid-icons/fa";
import { For } from "solid-js";

const Nav = () => {
	const location = useLocation();
	const current = (path: string) => path === location.pathname;

	const menuItems = [
		{ id: "/about", label: "Sobre Nosotros" },
		{ id: "/services", label: "Servicios" },
		{ id: "/gallery", label: "Galería" },
		{ id: "/contact", label: "Contacto" },
		{ id: "/login", label: "Login" },
	];

	return (
		<div class="navbar bg-base-100 sticky top-0 z-50 px-4 md:px-8">
			<div class="navbar-start">
				<A
					class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold"
					href="/"
				>
					SG
				</A>
			</div>

			<div class="navbar-end">
				{/* Desktop Menu */}
				<ul class="menu menu-horizontal px-1 hidden md:flex">
					<For each={menuItems}>
						{(item) => (
							<li classList={{ "menu-disabled": current(item.id) }}>
								<A
									classList={{
										"text-primary focus:text-neutral-content": current(item.id),
									}}
									href={item.id}
								>
									{item.label}
								</A>
							</li>
						)}
					</For>
				</ul>

				{/* Mobile Menu Button */}
				<div class="dropdown dropdown-end md:hidden">
					<div tabindex="0" role="button" class="btn btn-square btn-ghost">
						<FaSolidBars size={24} />
					</div>
					<ul
						tabindex="-1"
						class="menu menu-compact dropdown-content mt-2 p-2 shadow bg-base-100 rounded-box w-52"
					>
						<For each={menuItems}>
							{(item) => (
								<li classList={{ "menu-disabled": current(item.id) }}>
									<A
										classList={{
											"text-primary focus:text-neutral-content": current(
												item.id,
											),
										}}
										href={item.id}
									>
										{item.label}
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

export default Nav;
