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
	createCostCenter,
	getCostCenter,
	updateCostCenter,
} from "~/services/accounting/costCenters";
import type { CostCenters } from "~/types/appwrite.d";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const CostCenterSchema = object({
	name: string(),
});

type CostCenterForm = Omit<CostCenters, keyof Models.Row>;

export const CostCenterModal = (props: IProps) => {
	const auth = useUser();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [costCenter] = createResource(
		() =>
			appStore.showModal === Modals.CostCenter
				? appStore.modalProps?.id || ""
				: false || "",
		getCostCenter,
	);

	const [form, { Form, Field }] = createForm<CostCenterForm>({
		validate: valiForm(CostCenterSchema),
		initialValues: {
			name: "",
		},
	});

	createEffect(
		on(
			() => costCenter(),
			(costCenter) => {
				if (!costCenter || !isEdit()) return;

				setValues(form, {
					name: costCenter.name || "",
				});
			},
		),
	);

	const handleSubmit = async (values: CostCenterForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateCostCenter(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Centro de costos actualizado con éxito",
				});
			} else {
				await createCostCenter(auth()?.tenantId!, values as CostCenters);
				addAlert({
					type: "success",
					message: "Centro de costos creado con éxito",
				});
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar centro de costos",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Centro de Costos" id={Modals.CostCenter}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 gap-4">
					<Field name="name">
						{(field, props) => (
							<Input
								{...props}
								type="text"
								label="Nombre"
								placeholder="Nombre del centro de costos"
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
