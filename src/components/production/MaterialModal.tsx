import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, nullable, number, object, string } from "valibot";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { getSession } from "~/services/auth/session";
import { listCategories } from "~/services/production/categories";
import {
	createMaterial,
	getMaterial,
	updateMaterial,
} from "~/services/production/materials";
import type { Materials } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const MaterialSchema = object({
	categoryId: string(),
	name: string(),
	hasColor: boolean(),
	height: nullable(number()),
	width: nullable(number()),
	price: nullable(number()),
	hasUv: boolean(),
	hasLaminated: boolean(),
});

type MaterialForm = Omit<Materials, keyof Models.Row | "categoryId"> & {
	categoryId: string;
};

const materialDefaults: MaterialForm = {
	categoryId: "",
	name: "",
	hasColor: false,
	height: null,
	width: null,
	price: null,
	hasUv: false,
	hasLaminated: false,
};

const MaterialModal = (props: IProps) => {
	const auth = createAsync(() => getSession());
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [material] = createResource(
		() =>
			appStore.showModal === Modals.Material
				? appStore.modalProps?.id || ""
				: false,
		getMaterial,
	);
	const [categories] = createResource({}, listCategories);

	const [form, { Form, Field }] = createForm<MaterialForm>({
		validate: valiForm(MaterialSchema),
		initialValues: materialDefaults,
	});

	createEffect(
		on(
			() => material(),
			(material) => {
				if (!material || !isEdit()) return;

				setValues(form, {
					categoryId: material.categoryId,
					name: material.name || "",
					hasColor: material.hasColor ?? false,
					height: material.height ?? null,
					width: material.width ?? null,
					price: material.price ?? null,
					hasUv: material.hasUv ?? false,
					hasLaminated: material.hasLaminated ?? false,
				});
			},
		),
	);

	const handleSubmit = async (values: MaterialForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateMaterial(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Material actualizado con éxito",
				});
			} else {
				await createMaterial(auth()?.tenantId!, values as Materials);
				addAlert({ type: "success", message: "Material creado con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar material",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Material" id={Modals.Material}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-5">
						<Field name="categoryId">
							{(field, props) => (
								<Select
									{...props}
									label="Categoría"
									options={(categories()?.rows || []).map((c) => ({
										key: c.$id,
										label: c.name,
									}))}
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-5">
						<Field name="name">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Nombre"
									placeholder="Nombre del material"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-2 flex items-end">
						<Field name="hasColor" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Color"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-3">
						<Field name="height" type="number">
							{(field, props) => (
								<Input
									{...props}
									type="number"
									label="Alto (mm)"
									placeholder="Alto"
									value={field.value ?? ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-3">
						<Field name="width" type="number">
							{(field, props) => (
								<Input
									{...props}
									type="number"
									label="Ancho (mm)"
									placeholder="Ancho"
									value={field.value ?? ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-3">
						<Field name="price" type="number">
							{(field, props) => (
								<Input
									{...props}
									type="number"
									step="0.01"
									label="Precio"
									placeholder="0.00"
									value={field.value ?? ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-6 md:col-start-1">
						<Field name="hasUv" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="UV"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
						<Field name="hasLaminated" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Laminado"
									checked={field.value}
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

export default MaterialModal;
