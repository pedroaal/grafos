import type { Component } from "solid-js";
import { type JSX, Show, splitProps } from "solid-js";

interface IProps {
	label?: string;
	type?: "text" | "email" | "tel" | "password" | "url" | "date" | "number";
	placeholder?: string;
	value?: string | number | string[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	step?: string;
	name: string;
	error?: string;
	autofocus?: boolean;
	ref?: (element: HTMLInputElement) => void;
	onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange?: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
}

const Input: Component<IProps> = (props) => {
	const [, inputProps] = splitProps(props, ["label", "error"]);

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
			<input
				{...inputProps}
				id={props.name}
				aria-invalid={!!props.error}
				aria-errormessage={props.error ? `${props.name}-error` : undefined}
				class="input w-full"
				classList={{ "input-error": !!props.error }}
			/>
			<Show when={props.error}>
				<p class="label text-error">{props.error}</p>
			</Show>
		</fieldset>
	);
};

export default Input;
