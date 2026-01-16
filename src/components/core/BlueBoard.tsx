import { A } from "@solidjs/router";
import { FaSolidChevronRight } from "solid-icons/fa";
import type { JSX, ParentComponent } from "solid-js";
import { For } from "solid-js";
import type { Modals } from "~/config/modals";
import type { Routes } from "~/config/routes";
import { useApp } from "~/context/app";

interface IAction {
	label: string;
}

interface IButton extends IAction {
	onClick?: () => void;
	form?: string;
}

interface ILink extends IAction {
	href: Routes;
}

interface IModal extends IAction {
	key: Modals;
}

interface IProps {
	title?: string | JSX.Element;
	class?: string;
	actions?: IButton[];
	links?: ILink[];
	modals?: IModal[];
}

const BlueBoard: ParentComponent<IProps> = (props) => {
	const { openModal } = useApp();

	return (
		<div class="card bg-base-100 shadow-xl">
			<div class="bg-primary text-primary-content rounded-t-box p-3 d-print-none">
				<h2 class="card-title">{props.title}</h2>
			</div>

			<div class="card-body p-4">{props.children}</div>

			<div class="bg-base-200 rounded-b-box p-2 d-print-none">
				<div class="flex gap-2">
					<div class="flex-1 flex gap-2">
						<For each={props.links ?? []}>
							{(item) => (
								<A href={item.href} class="btn btn-primary btn-link btn-sm">
									{item.label}
									<FaSolidChevronRight size={16} />
								</A>
							)}
						</For>
					</div>

					<div class="flex gap-2">
						<For each={props.modals ?? []}>
							{(item) => (
								<button
									type="button"
									class="btn btn-primary btn-outline btn-sm"
									onClick={[openModal, item.key]}
								>
									{item.label}
								</button>
							)}
						</For>
						<For each={props.actions ?? []}>
							{(item) => (
								<button
									class="btn btn-primary btn-sm"
									type={item.form ? "submit" : "button"}
									onClick={item.onClick}
									form={item.form}
								>
									{item.label}
								</button>
							)}
						</For>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlueBoard;
