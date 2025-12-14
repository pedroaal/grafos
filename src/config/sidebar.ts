import type { IconTypes } from "solid-icons";
import { FaSolidChartLine, FaSolidPager } from "solid-icons/fa";
import { Routes } from "./routes";

interface SidebarLink {
	href: Routes;
	label: string;
	icon?: IconTypes;
	children?: SidebarLink[];
}

export const SidebarLinks: SidebarLink[] = [
	{
		href: Routes.dashboard,
		label: "Dashboard",
		icon: FaSolidPager,
	},
	{
		href: Routes.invoices,
		label: "Facturacion",
		icon: FaSolidChartLine,
		children: [
			{
				href: Routes.invoices,
				label: "Facturas",
			},
			{
				href: Routes.books,
				label: "Libros",
			},
			{
				href: Routes.costCenter,
				label: "Centro de costos",
			},
			{
				href: Routes.taxes,
				label: "Ivas",
			},
		],
	},
	{
		href: Routes.orders,
		label: "Produccion",
		icon: FaSolidPager,
		children: [
			{
				href: Routes.orders,
				label: "Pedidos",
			},
			{
				href: Routes.processes,
				label: "Procesos",
			},
			{
				href: Routes.materials,
				label: "Materiales",
			},
			{
				href: Routes.config,
				label: "Configuración",
			},
		],
	},
	{
		href: Routes.rrhh,
		label: "RRHH",
		icon: FaSolidPager,
		children: [
			{
				href: Routes.rrhh,
				label: "Nómina",
			},
			{
				href: Routes.attendance,
				label: "Asistencia",
			},
			{
				href: Routes.schedules,
				label: "Horarios",
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
				href: Routes.crm,
				label: "CRM",
			},
			{
				href: Routes.activities,
				label: "Actividades",
			},
			{
				href: Routes.contacts,
				label: "Contactos",
			},
		],
	},
	{
		href: Routes.users,
		label: "Usuarios",
		icon: FaSolidPager,
		children: [
			{
				href: Routes.profiles,
				label: "Perfiles",
			},
			{
				href: Routes.users,
				label: "Users",
			},
		],
	},
	{
		href: Routes.company,
		label: "Sistema",
		icon: FaSolidPager,
		children: [
			{
				href: Routes.company,
				label: "Empresa",
			},
			{
				href: Routes.billingCompanies,
				label: "Facturación",
			},
			{
				href: Routes.credentials,
				label: "Credenciales",
			},
		],
	},
];
