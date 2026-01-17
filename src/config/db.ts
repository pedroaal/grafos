export const DATABASE_ID =
	import.meta.env.VITE_APPWRITE_DATABASE_ID || "public";

export enum TABLES {
	// Accounting
	TAXES = "taxes",
	WITHHOLDINGS = "withholdings",
	COST_CENTERS = "cost-centers",
	BILLING_COMPANIES = "billing-companies",
	ACCOUNTING_BOOKS = "accounting-books",
	BANK_ACCOUNTS = "bank-accounts",
	BOOK_REFERENCES = "book-references",
	BOOK_TRANSACTIONS = "book-transactions",
	INVOICES = "invoices",
	INVOICE_PRODUCTS = "invoice-products",
	INVOICE_ORDERS = "invoice-orders",
	// Employees
	EQUIPMENT = "equipment",
	PAYROLL = "payroll",
	PAYROLL_DOCUMENTS = "payroll-documents",
	PAYROLL_EDUCATION = "payroll-education",
	PAYROLL_EQUIPMENT = "payroll-equipment",
	PAYROLL_FAMILY = "payroll-family",
	PAYROLL_REFERENCES = "payroll-references",
	SCHEDULES = "schedules",
	ATTENDANCE = "attendance",
	// Production
	AREAS = "areas",
	PROCESSES = "processes",
	CATEGORIES = "categories",
	MATERIALS = "materials",
	SUPPLIERS = "suppliers",
	INKS = "inks",
	ORDERS = "orders",
	ORDER_INKS = "order-inks",
	ORDER_MATERIALS = "order-materials",
	ORDER_PROCESSES = "order-processes",
	ORDER_PAYMENTS = "order-payments",
	CLIENT_FOLLOWERS = "client-followers",
	// Sales
	COMPANIES = "companies",
	CLIENTS = "clients",
	ACTIVITIES = "activities",
	COMMENTS = "comments",
	CONTACTS = "contacts",
	CRM = "crm",
	TEMPLATES = "templates",
	// Store
	PRODUCT_CATEGORIES = "product-categories",
	PRODUCTS = "products",
	// System
	COMPANY_DETAILS = "company-details",
	CREDENTIALS = "credentials",
	NOTIFICATIONS = "notifications",
	// Users
	FEATURES = "features",
	PROFILES = "profiles",
	PROFILE_FEATURES = "profile-features",
	USERS = "users",
	USER_BOOK = "user-book",
	USER_CLIENTS = "user-clients",
	USER_PROCESSES = "user-processes",
}
