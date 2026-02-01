import { createForm, setValues, valiForm } from "@modular-forms/solid";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { object, string } from "valibot";
import Input from "~/components/core/Input";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { createInk, getInk, updateInk } from "~/services/production/inks";
import type { Inks } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const InkSchema = object({
	color: string(),
});

type InkForm = Omit<Inks, keyof Models.Row>;

const InkModal = (props: IProps) => {
	const { authStore } = useAuth();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [ink] = createResource(
		() =>
			appStore.showModal === Modals.Ink
				? appStore.modalProps?.id || ""
				: false || "",
		getInk,
	);

	const [form, { Form, Field }] = createForm<InkForm>({
		validate: valiForm(InkSchema),
		initialValues: {
			color: "",
		},
	});

	createEffect(
		on(
			() => ink(),
			(ink) => {
				if (!ink || !isEdit()) return;

				setValues(form, {
					color: ink.color || "",
				});
			},
		),
	);

	const handleSubmit = async (values: InkForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateInk(appStore.modalProps!.id, values);
				addAlert({ type: "success", message: "Tinta actualizada con éxito" });
			} else {
				await createInk(authStore.tenantId!, values as Inks);
				addAlert({ type: "success", message: "Tinta creada con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar tinta",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Tinta" id={Modals.Ink}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-9">
						<Field name="color">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Color"
									placeholder="Color de la tinta"
									value={field.value}
									error={field.error}
									required
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

export default InkModal;
