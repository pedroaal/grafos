export interface IAlert {
	id: string;
	message: string;
	type: "success" | "error" | "warning" | "info";
	autoDismiss?: boolean;
}
