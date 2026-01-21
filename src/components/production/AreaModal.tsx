import { createForm, setValues, valiForm } from "@modular-forms/solid";
import type { Models } from "appwrite";
import { createEffect, createResource } from "solid-js";
import { number, object, string } from "valibot";
import Input from "~/components/core/Input";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { createArea, getArea, updateArea } from "~/services/production/areas";
import type { Areas } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const AreaSchema = object({
	name: string(),
	sortOrder: number(),
});

type AreaForm = Omit<Areas, keyof Models.Row>;

const AreaModal = (props: IProps) => {
	const { authStore } = useAuth();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [area] = createResource(
		() =>
			appStore.showModal === Modals.Area
				? appStore.modalProps?.id || ""
				: false || "",
		getArea,
	);

	const [form, { Form, Field }] = createForm<AreaForm>({
		validate: valiForm(AreaSchema),
		initialValues: {
			name: "",
			sortOrder: 0,
		},
	});

	createEffect(() => {
		const a = area();
		if (!a || !isEdit()) return;

		setValues(form, {
			name: a.name || "",
			sortOrder: a.sortOrder ?? 0,
		});
	});

	const handleSubmit = async (values: AreaForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateArea(appStore.modalProps!.id, values);
				addAlert({ type: "success", message: "Área actualizada con éxito" });
			} else {
				await createArea(authStore.tenantId, values as Areas);
				addAlert({ type: "success", message: "Área creada con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar área",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Area" id={Modals.Area}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-9">
						<Field name="name">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Nombre"
									placeholder="Nombre del área"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-3">
						<Field name="sortOrder" type="number">
							{(field, props) => (
								<Input
									{...props}
									type="number"
									label="Orden"
									placeholder="0"
									value={field.value ?? 0}
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

export default AreaModal;
