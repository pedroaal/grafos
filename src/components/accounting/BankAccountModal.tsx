import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import type { Models } from "appwrite";
import { createEffect, createResource, on } from "solid-js";
import { object, string } from "valibot";
import Input from "~/components/core/Input";
import { Modal } from "~/components/core/Modal";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";

import {
	createBankAccount,
	getBankAccount,
	updateBankAccount,
} from "~/services/accounting/bankAccounts";
import { getSession } from "~/services/auth/session";
import type { BankAccounts } from "~/types/appwrite.d";

interface IProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const BankAccountSchema = object({
	name: string(),
	accountNumber: string(),
});

type BankAccountForm = Omit<BankAccounts, keyof Models.Row>;

export const BankAccountModal = (props: IProps) => {
	const auth = createAsync(() => getSession());
	const { appStore, addLoader, removeLoader, addAlert, closeModal } = useApp();
	const isEdit = () => Boolean(appStore.modalProps?.id);

	const [bankAccount] = createResource(
		() =>
			appStore.showModal === Modals.BankAccount
				? appStore.modalProps?.id || ""
				: false || "",
		getBankAccount,
	);

	const [form, { Form, Field }] = createForm<BankAccountForm>({
		validate: valiForm(BankAccountSchema),
		initialValues: {
			name: "",
			accountNumber: "",
		},
	});

	createEffect(
		on(
			() => bankAccount(),
			(bankAccount) => {
				if (!bankAccount || !isEdit()) return;

				setValues(form, {
					name: bankAccount.name || "",
					accountNumber: bankAccount.accountNumber || "",
				});
			},
		),
	);

	const handleSubmit = async (values: BankAccountForm) => {
		const loaderId = addLoader();
		try {
			if (isEdit()) {
				await updateBankAccount(appStore.modalProps!.id, values);
				addAlert({
					type: "success",
					message: "Cuenta bancaria actualizada con éxito",
				});
			} else {
				await createBankAccount(auth()?.tenantId!, values as BankAccounts);
				addAlert({
					type: "success",
					message: "Cuenta bancaria creada con éxito",
				});
			}

			props.onSuccess?.();
			closeModal();
		} catch (error: any) {
			props.onError?.();
			addAlert({
				type: "error",
				message: error?.message || "Error al guardar cuenta bancaria",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<Modal title="Gestionar Cuenta Bancaria" id={Modals.BankAccount}>
			<Form onSubmit={handleSubmit}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field name="name">
						{(field, props) => (
							<Input
								{...props}
								type="text"
								label="Nombre del Banco"
								placeholder="Nombre del banco"
								value={field.value}
								error={field.error}
								required
							/>
						)}
					</Field>

					<Field name="accountNumber">
						{(field, props) => (
							<Input
								{...props}
								type="text"
								label="Número de Cuenta"
								placeholder="Número de cuenta"
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
