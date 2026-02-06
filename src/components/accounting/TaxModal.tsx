import { createForm, setValues, valiForm } from "@modular-forms/solid";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, number, object } from "valibot";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import { Modal } from "~/components/core/Modal";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { createTax, getTax, updateTax } from "~/services/accounting/taxes";
import type { Taxes } from "~/types/appwrite";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const TaxSchema = object({
	percentage: number(),
	active: boolean(),
});

type TaxForm = Omit<Taxes, keyof Models.Row>;

export const TaxModal = (props: IProps) => {
	const { authStore } = useAuth();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [tax] = createResource(
		() =>
			appStore.showModal === Modals.Tax
				? appStore.modalProps?.id || ""
				: false || "",
		getTax,
	);

	const [form, { Form, Field }] = createForm<TaxForm>({
		validate: valiForm(TaxSchema),
		initialValues: {
			percentage: 0,
			active: true,
		},
	});

	createEffect(
		on(
			() => tax(),
			(tax) => {
				if (!tax || !isEdit()) return;

				setValues(form, {
					percentage: tax.percentage ?? 0,
					active: tax.active ?? true,
				});
			},
		),
	);

	const handleSubmit = async (values: TaxForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateTax(appStore.modalProps!.id, values);
				addAlert({ type: "success", message: "Impuesto actualizado con éxito" });
			} else {
				await createTax(authStore.tenantId!, values as Taxes);
				addAlert({ type: "success", message: "Impuesto creado con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar impuesto",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Impuesto" id={Modals.Tax}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-9">
						<Field name="percentage" type="number">
							{(field, props) => (
								<Input
									{...props}
									type="number"
									label="Porcentaje"
									placeholder="0.00"
									value={field.value ?? 0}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-3 flex items-end">
						<Field name="active" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Activo"
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
