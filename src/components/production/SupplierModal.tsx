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
	createSupplier,
	getSupplier,
	updateSupplier,
} from "~/services/production/suppliers";
import type { Suppliers } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const SupplierSchema = object({
	name: string(),
	phone: string(),
	address: string(),
});

type SupplierForm = Omit<Suppliers, keyof Models.Row>;

const SupplierModal = (props: IProps) => {
	const auth = createAsync(() => getSession());
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [supplier] = createResource(
		() =>
			appStore.showModal === Modals.Supplier
				? appStore.modalProps?.id || ""
				: false || "",
		getSupplier,
	);

	const [form, { Form, Field }] = createForm<SupplierForm>({
		validate: valiForm(SupplierSchema),
		initialValues: {
			name: "",
			phone: "",
			address: "",
		},
	});

	createEffect(
		on(
			() => supplier(),
			(supplier) => {
				if (!supplier || !isEdit()) return;

				setValues(form, {
					name: supplier.name || "",
					phone: supplier.phone || "",
					address: supplier.address || "",
				});
			},
		),
	);

	const handleSubmit = async (values: SupplierForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateSupplier(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Proveedor actualizado con éxito",
				});
			} else {
				await createSupplier(auth()?.tenantId!, values as Suppliers);
				addAlert({ type: "success", message: "Proveedor creado con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar proveedor",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Proveedor" id={Modals.Supplier}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-4">
						<Field name="name">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Nombre"
									placeholder="Nombre del proveedor"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>
					<div class="md:col-span-4">
						<Field name="phone">
							{(field, props) => (
								<Input
									{...props}
									type="tel"
									label="Teléfono"
									placeholder="Teléfono del proveedor"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>
					<div class="md:col-span-4">
						<Field name="address">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Dirección"
									placeholder="Dirección del proveedor"
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

export default SupplierModal;
