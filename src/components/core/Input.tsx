import type { Component } from "solid-js";
import { type JSX, splitProps } from "solid-js";

interface IProps {
	label?: string;
	type?: "text" | "email" | "tel" | "password" | "url" | "date" | "number";
	placeholder?: string;
	value: string | undefined;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	name: string;
	error: string;
	autofocus?: boolean;
	ref: (element: HTMLInputElement) => void;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
}

const Input: Component<IProps> = (props) => {
	const [, inputProps] = splitProps(props, ["label", "error"]);

	return (
		<fieldset class="fieldset">
			<legend class="fieldset-legend">
				{props.label}
				{props.required && <span class="required">*</span>}
			</legend>
			<input
				{...inputProps}
				id={props.name}
				aria-invalid={!!props.error}
				aria-errormessage={props.error ? `${props.name}-error` : undefined}
				class="input w-full"
				classList={{ "input-error": !!props.error }}
			/>
			{props.error && <p class="label text-error">{props.error}</p>}
		</fieldset>
	);
};

export default Input;
