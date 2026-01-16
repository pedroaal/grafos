import { FaSolidXmark } from "solid-icons/fa";
import { type JSX, type ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";

export interface ModalProps {
	id: string;
	title?: string;
	children: JSX.Element;
}

export const Modal: ParentComponent<ModalProps> = (props) => {
	const { appStore, closeModal } = useApp();

	return (
		<Portal mount={document.getElementById("modals")!}>
			<Show when={appStore.showModal === props.id}>
				<div class="modal modal-open">
					<div class="modal-box relative max-w-5xl">
						<button
							class="btn btn-sm btn-circle absolute right-2 top-2"
							type="button"
							onClick={closeModal}
						>
							<FaSolidXmark size={16} />
						</button>
						{props.title && (
							<h3 class="font-bold text-lg mb-4">{props.title}</h3>
						)}
						{props.children}
					</div>
					<div class="modal-backdrop" role="button" onClick={closeModal} />
				</div>
			</Show>
		</Portal>
	);
};

export interface ConfirmModalProps {
	id?: string;
	title?: string;
	message: string;
	onConfirm: () => void;
	onCancel?: () => void;
	confirmText?: string;
	cancelText?: string;
}

export const ConfirmModal: ParentComponent<ConfirmModalProps> = (props) => {
	const { closeModal } = useApp();

	return (
		<Modal title={props.title || "Confirmar"} id={props.id || Modals.Confirm}>
			<div class="flex flex-col gap-2">
				<p>{props.message}</p>
				{props.children}
			</div>
			<div class="modal-action">
				<button
					class="btn"
					type="button"
					onClick={props.onCancel || closeModal}
				>
					{props.cancelText || "Cancelar"}
				</button>
				<button class="btn btn-primary" type="button" onClick={props.onConfirm}>
					{props.confirmText || "Confirmar"}
				</button>
			</div>
		</Modal>
	);
};
