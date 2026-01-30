import type { Component } from "solid-js";
import { For, type JSX, Show, splitProps } from "solid-js";
import type { IOption } from "~/types/core";

interface IProps {
	options: IOption[];
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	value?: string | number | string[] | undefined;
	name: string;
	error?: string;
	autofocus?: boolean;
	ref?: (element: HTMLSelectElement) => void;
	onInput?: JSX.EventHandler<HTMLSelectElement, InputEvent>;
	onChange?: JSX.EventHandler<HTMLSelectElement, Event>;
	onBlur?: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
}

const Select: Component<IProps> = (props) => {
	const [, selectProps] = splitProps(props, ["label", "error", "options"]);

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
			<select
				{...selectProps}
				id={props.name}
				class="select w-full"
				classList={{ "select-error": !!props.error }}
				aria-invalid={!!props.error}
				aria-describedby={props.error ? `${props.name}-error` : undefined}
				aria-errormessage={props.error ? `${props.name}-error` : undefined}
				required={props.required}
			>
				<option value="" disabled selected>
					{props.placeholder || "Seleccione una opción"}
				</option>
				<For each={props.options}>
					{(option) => <option value={option.key}>{option.label}</option>}
				</For>
			</select>
			<Show when={props.error}>
				<p class="label text-error">{props.error}</p>
			</Show>
		</fieldset>
	);
};

export default Select;
