import { createForm, setValues, valiForm } from "@modular-forms/solid";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { object, string, optional, nullable } from "valibot";
import Input from "~/components/core/Input";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import {
	createCredential,
	getCredential,
	updateCredential,
} from "~/services/system/credentials";
import type { Credentials } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const CredentialSchema = object({
	account: string(),
	username: string(),
	password: string(),
	hint: optional(nullable(string())),
	url: optional(nullable(string())),
});

type CredentialForm = Omit<Credentials, keyof Models.Row>;

const CredentialModal = (props: IProps) => {
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [credential] = createResource(
		() =>
			appStore.showModal === Modals.Credential && appStore.modalProps?.id
				? appStore.modalProps.id
				: false,
		getCredential,
	);

	const [form, { Form, Field }] = createForm<CredentialForm>({
		validate: valiForm(CredentialSchema),
		initialValues: {
			account: "",
			username: "",
			password: "",
			hint: null,
			url: null,
		},
	});

	createEffect(
		on(
			() => credential(),
			(credential) => {
				if (!credential || !isEdit()) return;

				setValues(form, {
					account: credential.account || "",
					username: credential.username || "",
					password: credential.password || "",
					hint: credential.hint || null,
					url: credential.url || null,
				});
			},
		),
	);

	const handleSubmit = async (values: CredentialForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateCredential(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Credencial actualizada con éxito",
				});
			} else {
				await createCredential(values as Credentials);
				addAlert({ type: "success", message: "Credencial creada con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar credencial",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Credencial" id={Modals.Credential}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-6">
						<Field name="account">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Cuenta"
									placeholder="Nombre de la cuenta"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-6">
						<Field name="username">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Usuario"
									placeholder="Nombre de usuario"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-12">
						<Field name="password">
							{(field, props) => (
								<Input
									{...props}
									type="password"
									label="Contraseña"
									placeholder="Contraseña"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-6">
						<Field name="hint">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Pista"
									placeholder="Pista para recordar"
									value={field.value || ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-6">
						<Field name="url">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="URL"
									placeholder="URL del servicio"
									value={field.value || ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>
				</div>

				<div class="modal-action">
					<button type="button" class="btn" onClick={closeModal}>
						Cancelar
					</button>
					<button type="submit" class="btn btn-primary">
						Guardar
					</button>
				</div>
			</Form>
		</Modal>
	);
};

export default CredentialModal;
