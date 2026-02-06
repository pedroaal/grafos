import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { object, string } from "valibot";
import Input from "~/components/core/Input";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { getSession } from "~/services/auth/session";
import {
	createCategory,
	getCategory,
	updateCategory,
} from "~/services/production/categories";
import type { Categories } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const CategorySchema = object({
	name: string(),
});

type CategoryForm = Omit<Categories, keyof Models.Row>;

const CategoryModal = (props: IProps) => {
	const auth = createAsync(() => getSession());
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [category] = createResource(
		() =>
			appStore.showModal === Modals.Category
				? appStore.modalProps?.id || ""
				: false,
		getCategory,
	);

	const [form, { Form, Field }] = createForm<CategoryForm>({
		validate: valiForm(CategorySchema),
		initialValues: { name: "" },
	});

	createEffect(
		on(
			() => category(),
			(category) => {
				if (!category || !isEdit()) return;

				setValues(form, {
					name: category.name || "",
				});
			},
		),
	);

	const handleSubmit = async (values: CategoryForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateCategory(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Categoría actualizada con éxito",
				});
			} else {
				await createCategory(auth()?.tenantId!, values as Categories);
				addAlert({ type: "success", message: "Categoría creada con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar categoría",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Categoria" id={Modals.Category}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-10">
						<Field name="name">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Nombre"
									placeholder="Nombre de la categoría"
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

export default CategoryModal;
