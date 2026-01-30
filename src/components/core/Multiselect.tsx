import { FaSolidCheck, FaSolidChevronDown, FaSolidXmark } from "solid-icons/fa";
import { type Component, For, Show } from "solid-js";
import type { IOption } from "~/types/core";

interface IProps {
	options: IOption[];
	placeholder?: string;
	name: string;
	value?: string[];
	label?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	onChange?: (selected: string[]) => void;
}

const MultiSelect: Component<IProps> = (props) => {
	const getSelectedOptions = () =>
		props.options.filter((opt) => props.value?.includes(opt.key) || false);

	const toggleOption = (key: string) => {
		const current = props.value || [];
		const newValues = current.includes(key)
			? current.filter((v) => v !== key)
			: [...current, key];

		props.onChange?.(newValues);
	};

	return (
		<fieldset class="fieldset">
			<Show when={props.label}>
				<legend class="fieldset-legend">
					{props.label}
					<Show when={props.required}>
						<span class="required">*</span>
					</Show>
				</legend>
			</Show>
			<div class="dropdown w-full">
				<div
					// tabindex="0"
					// role="button"
					class="border border-base-content/20 rounded box-border focus:border-base-content focus:outline-2 focus:outline-offset-2 focus:outline-base-content w-full flex gap-2 p-2 items-center"
				>
					<div class="flex-1 flex flex-wrap gap-1">
						<Show
							when={props.value?.length}
							fallback={
								<span class="text-base-content/50">
									{props.placeholder || "Select options..."}
								</span>
							}
						>
							<For each={getSelectedOptions()}>
								{(option) => (
									<span class="badge badge-primary">{option.label}</span>
								)}
							</For>
						</Show>
					</div>
					<button tabIndex={0} type="button" class="size-6">
						<FaSolidChevronDown size={16} />
					</button>
				</div>

				<ul
					tabindex="-1"
					class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-1 max-h-60 overflow-auto flex-nowrap z-10"
				>
					<For each={props.options}>
						{(option) => (
							<li>
								<button
									class="w-full flex justify-between items-center"
									type="button"
									onClick={() => toggleOption(option.key)}
								>
									{option.label}
									<Show
										when={props.value?.includes(option.key)}
										fallback={<FaSolidXmark size={12} />}
									>
										<FaSolidCheck size={12} />
									</Show>
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
			<Show when={props.error}>
				<p class="label text-error">{props.error}</p>
			</Show>
		</fieldset>
	);
};

export default MultiSelect;
