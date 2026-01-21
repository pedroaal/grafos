import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { createEffect, createResource } from "solid-js";
import { boolean, nullable, number, object, string } from "valibot";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { listAreas } from "~/services/production/areas";
import {
	createProcess,
	getProcess,
	listProcesses,
	updateProcess,
} from "~/services/production/processes";
import type { Areas, Processes } from "~/types/appwrite";
import { Modal } from "../core/Modal";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const ProcessSchema = object({
	areaId: string(),
	name: string(),
	goal: number(),
	machineTime: nullable(string()),
	operatorTime: nullable(string()),
	internal: boolean(),
	followUp: boolean(),
	parentId: nullable(string()),
});

type ProcessForm = Omit<Processes, "$id" | "areaId" | "parentId"> & {
	areaId: string;
	parentId?: string | null;
};

const processDefaults: ProcessForm = {
	areaId: "",
	name: "",
	goal: 0,
	machineTime: null,
	operatorTime: null,
	internal: false,
	followUp: false,
	parentId: null,
};

const ProcessModal = (props: IProps) => {
	const { authStore } = useAuth();
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [process] = createResource(
		() =>
			appStore.showModal === Modals.Process
				? appStore.modalProps?.id || ""
				: false || "",
		getProcess,
	);
	const [areas] = createResource({}, listAreas);
	const [processes] = createResource({}, listProcesses);

	const [form, { Form, Field }] = createForm<ProcessForm>({
		validate: valiForm(ProcessSchema),
		initialValues: processDefaults,
	});

	createEffect(() => {
		const p = process();
		if (!p || !isEdit()) return;

		setValues(form, {
			areaId: (p.areaId as any)?.$id || (p.areaId as any) || "",
			name: p.name || "",
			goal: p.goal ?? 0,
			machineTime: p.machineTime ?? null,
			operatorTime: p.operatorTime ?? null,
			internal: p.internal ?? false,
			followUp: p.followUp ?? false,
			parentId: p.parentId ?? null,
		});
	});

	const handleSubmit = async (values: ProcessForm) => {
		const loaderId = addLoader();
		try {
			const payload: Partial<Processes> = {
				areaId: values.areaId as unknown as Areas,
				name: values.name,
				goal: Number(values.goal),
				machineTime: values.machineTime ?? null,
				operatorTime: values.operatorTime ?? null,
				internal: !!values.internal,
				followUp: !!values.followUp,
				parentId: values.parentId || null,
			};

			if (isEdit()) {
				await updateProcess(appStore.modalProps!.id, payload);
				addAlert({ type: "success", message: "Proceso actualizado con éxito" });
			} else {
				await createProcess(authStore.tenantId, payload as Processes);
				addAlert({ type: "success", message: "Proceso creado con éxito" });
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar proceso",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Proceso" id={Modals.Process}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div class="md:col-span-5">
						<Field name="areaId">
							{(field, props) => (
								<Select
									{...props}
									label="Area"
									options={(areas()?.rows || []).map((a) => ({
										key: a.$id,
										label: a.name,
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
									placeholder="Nombre del proceso"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-2">
						<Field name="goal" type="number">
							{(field, props) => (
								<Input
									{...props}
									type="number"
									label="Objetivo"
									placeholder="0"
									value={field.value}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-4">
						<Field name="machineTime">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Tiempo Máquina"
									placeholder="e.g. 00:30"
									value={field.value ?? ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-4">
						<Field name="operatorTime">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Tiempo Operador"
									placeholder="e.g. 00:10"
									value={field.value ?? ""}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-2 flex items-end gap-4">
						<Field name="internal" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Interno"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
						<Field name="followUp" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Seguimiento"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
					</div>

					<div class="md:col-span-6">
						<Field name="parentId">
							{(field, props) => (
								<Select
									{...props}
									label="Padre (opcional)"
									options={(processes()?.rows || [])
										.filter((pr) => pr.$id !== appStore.modalProps?.id)
										.map((pr) => ({ key: pr.$id, label: pr.name }))}
									value={field.value || ""}
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

export default ProcessModal;
