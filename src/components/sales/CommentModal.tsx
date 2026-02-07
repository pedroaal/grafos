import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { nullable, object, string } from "valibot";
import { Modal } from "~/components/core/Modal";
import Select from "~/components/core/Select";
import Textarea from "~/components/core/Textarea";

import { Modals } from "~/config/modals";
import { MAX_DROPDOWN_ITEMS } from "~/config/pagination";
import { useApp } from "~/context/app";
import { useUser } from "~/hooks/useUser";

import {
	createComment,
	getComment,
	updateComment,
} from "~/services/sales/comments";
import { listContacts } from "~/services/sales/contacts";
import { listUsers } from "~/services/users/users";
import type { Comments } from "~/types/appwrite";
import type { IOption } from "~/types/core";

interface CommentModalProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const CommentValidationSchema = object({
	userId: string(),
	contactId: string(),
	comment: string(),
	parentId: nullable(string()),
});

type CommentFormFields = Omit<Comments, keyof Models.Row>;

const CommentModal = (props: CommentModalProps) => {
	const auth = useUser();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();

	const isModifying = (): boolean => Boolean(appStore.modalProps?.id);

	const [commentData] = createResource(() => {
		if (appStore.showModal !== Modals.Comment) return "";
		return appStore.modalProps?.id || "";
	}, getComment);

	const [usersList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listUsers,
	);

	const [contactsList] = createResource(
		() => ({ page: 1, perPage: MAX_DROPDOWN_ITEMS }),
		listContacts,
	);

	const [commentForm, { Form, Field }] = createForm<CommentFormFields>({
		validate: valiForm(CommentValidationSchema),
		initialValues: {
			userId: (auth()?.user?.$id || "") as any,
			contactId: (appStore.modalProps?.contactId || "") as any,
			comment: "",
			parentId: null,
		},
	});

	createEffect(
		on(
			() => commentData(),
			(existingComment) => {
				if (!existingComment || !isModifying()) return;

				setValues(commentForm, {
					userId: existingComment.userId.$id as any,
					contactId: existingComment.contactId.$id as any,
					comment: existingComment.comment || "",
					parentId: existingComment.parentId || null,
				});
			},
		),
	);

	const saveComment = async (formValues: CommentFormFields): Promise<void> => {
		const operationId = addLoader();
		try {
			if (isModifying()) {
				await updateComment(appStore.modalProps!.id, formValues);
				addAlert({ type: "success", message: "Comentario modificado" });
			} else {
				await createComment(formValues as Comments);
				addAlert({ type: "success", message: "Comentario registrado" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (err: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: err?.message || "Fallo al guardar comentario",
			});
		} finally {
			removeLoader(operationId);
		}
	};

	const buildUserOptions = (): IOption[] => {
		const users = usersList()?.rows || [];
		return users.map((u) => ({
			key: u.$id,
			label: `${u.firstName} ${u.lastName}`,
		}));
	};

	const buildContactOptions = (): IOption[] => {
		const contacts = contactsList()?.rows || [];
		return contacts.map((c) => ({
			key: c.$id,
			label: `${c.firstName} ${c.lastName}`,
		}));
	};

	return (
		<Modal title="Gestionar Comentario" id={Modals.Comment}>
			<Form onSubmit={saveComment}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-6">
						<Field name="userId">
							{(field, props) => (
								<Select
									{...props}
									label="Usuario"
									options={buildUserOptions()}
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-6">
						<Field name="contactId">
							{(field, props) => (
								<Select
									{...props}
									label="Contacto"
									options={buildContactOptions()}
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-12">
						<Field name="comment">
							{(field, props) => (
								<Textarea
									{...props}
									label="Comentario"
									placeholder="Escriba su comentario..."
									value={field.value}
									error={field.error}
									rows={5}
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

export default CommentModal;
