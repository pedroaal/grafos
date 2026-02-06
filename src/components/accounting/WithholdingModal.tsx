import { createForm, setValues, valiForm } from "@modular-forms/solid";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { boolean, enum as vEnum, number, object, string } from "valibot";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { Modal } from "~/components/core/Modal";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import {
	createWithholding,
	getWithholding,
	updateWithholding,
} from "~/services/accounting/withholdings";
import { type Withholdings, WithholdingsType } from "~/types/appwrite.d";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const WithholdingSchema = object({
	percentage: number(),
	description: string(),
	type: vEnum(WithholdingsType),
	active: boolean(),
});

type WithholdingForm = Omit<Withholdings, keyof Models.Row>;

const WITHHOLDING_TYPE_OPTIONS = [
	{ key: WithholdingsType.TAX, label: "Impuesto" },
	{ key: WithholdingsType.SOURCE, label: "Fuente" },
];

export const WithholdingModal = (props: IProps) => {
	const { authStore } = useAuth();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [withholding] = createResource(
		() =>
			appStore.showModal === Modals.Withholding
				? appStore.modalProps?.id || ""
				: false || "",
		getWithholding,
	);

	const [form, { Form, Field }] = createForm<WithholdingForm>({
		validate: valiForm(WithholdingSchema),
		initialValues: {
			percentage: 0,
			description: "",
			type: WithholdingsType.TAX,
			active: true,
		},
	});

	createEffect(
		on(
			() => withholding(),
			(withholding) => {
				if (!withholding || !isEdit()) return;

				setValues(form, {
					percentage: withholding.percentage ?? 0,
					description: withholding.description || "",
					type: withholding.type || WithholdingsType.TAX,
					active: withholding.active ?? true,
				});
			},
		),
	);

	const handleSubmit = async (values: WithholdingForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateWithholding(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Retención actualizada con éxito",
				});
			} else {
				await createWithholding(authStore.tenantId!, values as Withholdings);
				addAlert({ type: "success", message: "Retención creada con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar retención",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Retención" id={Modals.Withholding}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-6">
						<Field name="description">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Descripción"
									placeholder="Descripción de la retención"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-3">
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

					<div class="md:col-span-3">
						<Field name="type">
							{(field, props) => (
								<Select
									{...props}
									label="Tipo"
									options={WITHHOLDING_TYPE_OPTIONS}
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-12 flex items-end">
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
