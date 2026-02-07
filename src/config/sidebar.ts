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
import { AppRoutes } from "./routes";

interface SidebarLink {
	feature: string;
	href: AppRoutes;
	label: string;
	icon?: IconTypes;
	children?: SidebarLink[];
}

export const SidebarLinks: SidebarLink[] = [
	{
		feature: "admin_dashboard",
		href: AppRoutes.dashboard,
		label: "Dashboard",
		icon: FaSolidGauge,
	},
	{
		feature: "billing",
		href: AppRoutes.invoices,
		label: "Facturacion",
		icon: FaSolidFileInvoiceDollar,
		children: [
			{
				feature: "billing",
				href: AppRoutes.invoices,
				label: "Facturas",
			},
			{
				feature: "accounting_books",
				href: AppRoutes.accountingBooks,
				label: "Libros",
			},
			{
				feature: "billing",
				href: AppRoutes.billingCompanies,
				label: "Empresas",
			},
			{
				feature: "billing",
				href: AppRoutes.banks,
				label: "Bancos",
			},
			{
				feature: "billing",
				href: AppRoutes.taxes,
				label: "Ivas",
			},
		],
	},
	{
		feature: "payroll",
		href: AppRoutes.payrolls,
		label: "RRHH",
		icon: FaSolidCalendarDays,
		children: [
			{
				feature: "payroll",
				href: AppRoutes.payrolls,
				label: "Nómina",
			},
			{
				feature: "attendance",
				href: AppRoutes.attendances,
				label: "Asistencia",
			},
			{
				feature: "attendance",
				href: AppRoutes.schedules,
				label: "Horarios",
			},
			{
				feature: "payroll",
				href: AppRoutes.equipment,
				label: "Equipo",
			},
		],
	},
	{
		feature: "production",
		href: AppRoutes.orders,
		label: "Produccion",
		icon: FaSolidIndustry,
		children: [
			{
				feature: "production",
				href: AppRoutes.orders,
				label: "Pedidos",
			},
			{
				feature: "order_report",
				href: AppRoutes.ordersReport,
				label: "Reporte de Pedidos",
			},
			{
				feature: "payment_report",
				href: AppRoutes.paymentsReport,
				label: "Reporte de Pagos",
			},
			{
				feature: "processes_report",
				href: AppRoutes.processesReport,
				label: "Reporte de Procesos",
			},
			{
				feature: "processes",
				href: AppRoutes.processes,
				label: "Procesos",
			},
			{
				feature: "materials",
				href: AppRoutes.materials,
				label: "Materiales",
			},
		],
	},
	{
		feature: "sales",
		href: AppRoutes.clients,
		label: "Ventas",
		icon: FaSolidAddressBook,
		children: [
			{
				feature: "sales",
				href: AppRoutes.companies,
				label: "Compañías",
			},
			{
				feature: "sales",
				href: AppRoutes.contacts,
				label: "Contactos",
			},
			{
				feature: "contacts",
				href: AppRoutes.clients,
				label: "Clientes",
			},
			{
				feature: "sales",
				href: AppRoutes.tasks,
				label: "CRM",
			},
			{
				feature: "activities",
				href: AppRoutes.templates,
				label: "Plantillas",
			},
			{
				feature: "activities",
				href: AppRoutes.activities,
				label: "Actividades",
			},
		],
	},
	{
		feature: "users",
		href: AppRoutes.users,
		label: "Usuarios",
		icon: FaSolidUsers,
		children: [
			{
				feature: "profiles",
				href: AppRoutes.profiles,
				label: "Perfiles",
			},
			{
				feature: "users",
				href: AppRoutes.users,
				label: "Usuarios",
			},
		],
	},
	{
		feature: "system",
		href: AppRoutes.companyDetails,
		label: "Sistema",
		icon: FaSolidServer,
		children: [
			{
				feature: "system",
				href: AppRoutes.companyDetails,
				label: "Empresa",
			},
			{
				feature: "credentials",
				href: AppRoutes.credentials,
				label: "Credenciales",
			},
		],
	},
];
