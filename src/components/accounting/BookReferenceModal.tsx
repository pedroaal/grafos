import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { object, string } from "valibot";
import Input from "~/components/core/Input";
import { Modal } from "~/components/core/Modal";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { useUser } from "~/hooks/useUser";

import {
	createBookReference,
	getBookReference,
	updateBookReference,
} from "~/services/accounting/bookReferences";
import type { BookReferences } from "~/types/appwrite.d";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const BookReferenceSchema = object({
	reference: string(),
	description: string(),
});

type BookReferenceForm = Omit<BookReferences, keyof Models.Row>;

export const BookReferenceModal = (props: IProps) => {
	const auth = useUser();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [bookReference] = createResource(
		() =>
			appStore.showModal === Modals.BookReference
				? appStore.modalProps?.id || ""
				: false || "",
		getBookReference,
	);

	const [form, { Form, Field }] = createForm<BookReferenceForm>({
		validate: valiForm(BookReferenceSchema),
		initialValues: {
			reference: "",
			description: "",
		},
	});

	createEffect(
		on(
			() => bookReference(),
			(bookReference) => {
				if (!bookReference || !isEdit()) return;

				setValues(form, {
					reference: bookReference.reference || "",
					description: bookReference.description || "",
				});
			},
		),
	);

	const handleSubmit = async (values: BookReferenceForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateBookReference(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Referencia de libro actualizada con éxito",
				});
			} else {
				await createBookReference(auth()?.tenantId!, values as BookReferences);
				addAlert({
					type: "success",
					message: "Referencia de libro creada con éxito",
				});
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar referencia de libro",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Referencia de Libro" id={Modals.BookReference}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field name="reference">
						{(field, props) => (
							<Input
								{...props}
								type="text"
								label="Referencia"
								placeholder="Código de referencia"
								value={field.value}
								error={field.error}
								required
							/>
						)}
					</Field>

					<Field name="description">
						{(field, props) => (
							<Input
								{...props}
								type="text"
								label="Descripción"
								placeholder="Descripción de la referencia"
								value={field.value}
								error={field.error}
								required
							/>
						)}
					</Field>
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
