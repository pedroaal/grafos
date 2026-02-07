export const DATABASE_ID =
	import.meta.env.VITE_APPWRITE_DATABASE_ID || "public";

export enum TABLES {
	// Accounting
	COST_CENTERS = "cost-centers",
	TAXES = "taxes",
	WITHHOLDINGS = "withholdings",
	BILLING_COMPANIES = "billing-companies",
	ACCOUNTING_BOOKS = "accounting-books",
	BANK_ACCOUNTS = "bank-accounts",
	BOOK_REFERENCES = "book-references",
	BOOK_TRANSACTIONS = "book-transactions",
	INVOICES = "invoices",
	INVOICE_PRODUCTS = "invoice-products",
	INVOICE_ORDERS = "invoice-orders",
	// Employees
	SCHEDULES = "schedules",
	ATTENDANCE = "attendance",
	EQUIPMENT = "equipment",
	PAYROLL = "payroll",
	PAYROLL_DOCUMENTS = "payroll-documents",
	PAYROLL_EDUCATION = "payroll-education",
	PAYROLL_EQUIPMENT = "payroll-equipment",
	PAYROLL_FAMILY = "payroll-family",
	PAYROLL_REFERENCES = "payroll-references",
	// Production
	INKS = "inks",
	CATEGORIES = "categories",
	SUPPLIERS = "suppliers",
	MATERIALS = "materials",
	AREAS = "areas",
	PROCESSES = "processes",
	ORDERS = "orders",
	ORDER_INKS = "order-inks",
	ORDER_MATERIALS = "order-materials",
	ORDER_PROCESSES = "order-processes",
	ORDER_PAYMENTS = "order-payments",
	// Sales
	COMPANIES = "companies",
	CONTACTS = "contacts",
	CLIENTS = "clients",
	TEMPLATES = "templates",
	ACTIVITIES = "activities",
	TASKS = "tasks",
	COMMENTS = "comments",
	// Store
	PRODUCT_CATEGORIES = "product-categories",
	PRODUCTS = "products",
	// System
	NOTIFICATIONS = "notifications",
	COMPANY_DETAILS = "company-details",
	CREDENTIALS = "credentials",
	// Users
	FEATURES = "features",
	PROFILES = "profiles",
	PROFILE_FEATURES = "profile-features",
	USERS = "users",
	USER_BOOK = "user-book",
	USER_CLIENTS = "user-clients",
	USER_PROCESSES = "user-processes",
}
