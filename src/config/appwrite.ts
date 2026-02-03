export enum PayrollBloodType {
	AP = "Ap",
	AN = "An",
	BP = "Bp",
	BN = "Bn",
	A_BP = "ABp",
	A_BN = "ABn",
	OP = "Op",
	ON = "On",
}

export enum PayrollGender {
	MALE = "male",
	FEMALE = "female",
	OTHER = "other",
}

export enum PayrollMaritalStatus {
	SINGLE = "single",
	MARRIED = "married",
	DIVORCED = "divorced",
	WIDOWED = "widowed",
	FREE_UNION = "free union",
}

export enum PayrollBankAccountType {
	SAVINGS = "savings",
	CHECKING = "checking",
}

export enum PayrollEducationEducationLevel {
	PRIMARY = "primary",
	SECONDARY = "secondary",
	POST_SECONDARY = "post-secondary",
	TERTIARY = "tertiary",
	OTHER = "other",
}

export enum PayrollFamilyRelationship {
	PARENT = "parent",
	SPOUSE = "spouse",
	CHILD = "child",
	OTHER = "other",
}

export enum ClientsTaxpayerType {
	PERSON_NON_OBLIGATED = "person-non-obligated",
	PERSON_OBLIGATED = "person-obligated",
	PUBLIC_SOCIETY = "public-society",
	PRIVATE_SOCIETY = "private-society",
}

export enum OrdersStatus {
	PENDING = "pending",
	PAID = "paid",
	OTHER = "other",
	CANCELED = "canceled",
}

export enum WithholdingsType {
	TAX = "tax",
	SOURCE = "source",
}

export enum InvoicesStatus {
	PENDING = "pending",
	PAID = "paid",
}

export enum InvoicesPaymentType {
	CASH = "cash",
	TRANSFER = "transfer",
	EXCHANGE = "exchange",
	CARD = "card",
}
