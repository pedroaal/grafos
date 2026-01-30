import type { FieldValues, FormStore } from "@modular-forms/solid";
import {
	FaSolidCheck,
	FaSolidCheckDouble,
	FaSolidChevronDown,
	FaSolidXmark,
} from "solid-icons/fa";
import {
	type Component,
	createEffect,
	createSignal,
	For,
	type JSX,
	Show,
} from "solid-js";
import type { IOption } from "~/types/core";

interface IProps {
	options: IOption[];
	placeholder?: string;
	name: string;
	value?: string[];
	onChange?: (selected: string[]) => void;
	onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	ref?: (element: HTMLInputElement) => void;
}

const MultiSelect: Component<IProps> = (props) => {
	const [selectedValues, setSelectedValues] = createSignal<string[]>(
		props.value || [],
	);

	const getSelectedOptions = () =>
		props.options.filter((opt) => selectedValues().includes(opt.key));

	const toggleOption = (key: string) => {
		const current = selectedValues();
		const newValues = current.includes(key)
			? current.filter((v) => v !== key)
			: [...current, key];

		setSelectedValues(newValues);
		props.onChange?.(newValues);
	};

	const removeValue = (key: string) => {
		const newValues = selectedValues().filter((v) => v !== key);
		setSelectedValues(newValues);
		props.onChange?.(newValues);
	};

	return (
		<>
			<input
				type="hidden"
				ref={props.ref}
				name={props.name}
				value={JSON.stringify(selectedValues())}
			/>

			<div class="dropdown w-full">
				<div
					tabindex="0"
					role="button"
					class="btn btn-outline border-base-content/20 focus:border-base-content focus:outline-2 focus:outline-offset-2 focus:outline-base-content w-full gap-2"
				>
					<div class="flex flex-wrap gap-1 flex-1">
						{selectedValues().length === 0 ? (
							<span class="text-base-content/50">
								{props.placeholder || "Select options..."}
							</span>
						) : (
							<For each={getSelectedOptions()}>
								{(option) => (
									<span class="badge badge-primary">{option.label}</span>
								)}
							</For>
						)}
					</div>
					<FaSolidChevronDown size={16} />
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
										when={selectedValues().includes(option.key)}
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
		</>
	);
};

export default MultiSelect;
