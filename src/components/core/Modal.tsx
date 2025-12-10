import { FaSolidXmark } from "solid-icons/fa";
import { type JSX, type ParentComponent, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { PortalContext } from "~/context/portal";

export interface ModalProps {
	id: string;
	title?: string;
	children: JSX.Element;
}

/**
 * Modal component that renders in a Portal
 */
export const Modal: ParentComponent<ModalProps> = (props) => {
	const [store, { closeModal }] = useContext(PortalContext);

	return (
		<Portal mount={document.getElementById("modals")!}>
			<Show when={store.showModal === props.id}>
				<div class="modal modal-open">
					<div class="modal-box relative max-w-5xl">
						<button
							class="btn btn-sm btn-circle absolute right-2 top-2"
							type="button"
							onClick={closeModal}
						>
							<FaSolidXmark />
						</button>
						{props.title && (
							<h3 class="font-bold text-lg mb-4">{props.title}</h3>
						)}
						<div class="py-4">{props.children}</div>
					</div>
					<div class="modal-backdrop" onClick={closeModal} />
				</div>
			</Show>
		</Portal>
	);
};

/**
 * Confirmation Modal
 */
export interface ConfirmModalProps {
	title?: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}

export const ConfirmModal: ParentComponent<ConfirmModalProps> = (props) => {
	return (
		<Modal title={props.title || "Confirmar"}>
			<p class="py-4">{props.message}</p>
			<div class="modal-action">
				<button class="btn" type="button" onClick={props.onCancel}>
					{props.cancelText || "Cancelar"}
				</button>
				<button class="btn btn-primary" type="button" onClick={props.onConfirm}>
					{props.confirmText || "Confirmar"}
				</button>
			</div>
		</Modal>
	);
};
