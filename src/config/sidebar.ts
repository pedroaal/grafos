import type { IconTypes } from "solid-icons";
import {
	FaSolidAddressBook,
	FaSolidCalendarDays,
	FaSolidFileInvoiceDollar,
	FaSolidGauge,
	FaSolidIndustry,
	FaSolidServer,
	FaSolidUsers,
} from "solid-icons/fa";
import { Routes } from "./routes";

interface SidebarLink {
	feature: string;
	href: Routes;
	label: string;
	icon?: IconTypes;
	children?: SidebarLink[];
}

export const SidebarLinks: SidebarLink[] = [
	{
		feature: "admin_dashboard",
		href: Routes.dashboard,
		label: "Dashboard",
		icon: FaSolidGauge,
	},
	{
		feature: "billing",
		href: Routes.invoices,
		label: "Facturacion",
		icon: FaSolidFileInvoiceDollar,
		children: [
			{
				feature: "billing",
				href: Routes.invoices,
				label: "Facturas",
			},
			{
				feature: "accounting_books",
				href: Routes.books,
				label: "Libros",
			},
			{
				feature: "billing",
				href: Routes.costCenter,
				label: "Centro de costos",
			},
			{
				feature: "billing",
				href: Routes.taxes,
				label: "Ivas",
			},
		],
	},
	{
		feature: "production",
		href: Routes.orders,
		label: "Produccion",
		icon: FaSolidIndustry,
		children: [
			{
				feature: "production",
				href: Routes.orders,
				label: "Pedidos",
			},
			{
				feature: "order_report",
				href: Routes.ordersReport,
				label: "Reporte de Pedidos",
			},
			{
				feature: "payment_report",
				href: Routes.paymentsReport,
				label: "Reporte de Pagos",
			},
			{
				feature: "processes_report",
				href: Routes.processesReport,
				label: "Reporte de Procesos",
			},
			{
				feature: "processes",
				href: Routes.processes,
				label: "Procesos",
			},
			{
				feature: "materials",
				href: Routes.materials,
				label: "Materiales",
			},
		],
	},
	{
		feature: "payroll",
		href: Routes.rrhh,
		label: "RRHH",
		icon: FaSolidCalendarDays,
		children: [
			{
				feature: "payroll",
				href: Routes.rrhh,
				label: "Nómina",
			},
			{
				feature: "attendance",
				href: Routes.attendance,
				label: "Asistencia",
			},
			{
				feature: "attendance",
				href: Routes.schedules,
				label: "Horarios",
			},
		],
	},
	{
		feature: "sales",
		href: Routes.clients,
		label: "Ventas",
		icon: FaSolidAddressBook,
		children: [
			{
				feature: "contacts",
				href: Routes.clients,
				label: "Clientes",
			},
			{
				feature: "sales",
				href: Routes.tasks,
				label: "CRM",
			},
			{
				feature: "activities",
				href: Routes.activities,
				label: "Actividades",
			},
			{
				feature: "sales",
				href: Routes.contacts,
				label: "Contactos",
			},
		],
	},
	{
		feature: "users",
		href: Routes.users,
		label: "Usuarios",
		icon: FaSolidUsers,
		children: [
			{
				feature: "profiles",
				href: Routes.profiles,
				label: "Perfiles",
			},
			{
				feature: "users",
				href: Routes.users,
				label: "Usuarios",
			},
		],
	},
	{
		feature: "system",
		href: Routes.company,
		label: "Sistema",
		icon: FaSolidServer,
		children: [
			{
				feature: "system",
				href: Routes.company,
				label: "Empresa",
			},
			{
				feature: "billing_companies",
				href: Routes.billingCompanies,
				label: "Facturación",
			},
			{
				feature: "credentials",
				href: Routes.credentials,
				label: "Credenciales",
			},
		],
	},
];
