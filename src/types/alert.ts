export interface IAlert {
	id: string;
	message: string;
	type: "success" | "error" | "warning" | "info";
	dismissible?: boolean;
}

export interface IAlertOptions {
	dismissible: boolean;
	timeout: number;
}
