import type { Component } from "solid-js";
import { type JSX, splitProps } from "solid-js";

interface IProps {
	name: string;
	label?: string;
	placeholder?: string;
	checked?: boolean;
	error?: string;
	required?: boolean;
	class?: string;
	containerClass?: string;
	labelClass?: string;
	errorClass?: string;
	ref: (element: HTMLInputElement) => void;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	disabled?: boolean;
	readonly?: boolean;
}

const Checkbox: Component<IProps> = (props) => {
	const [, checkboxProps] = splitProps(props, [
		"checked",
		"label",
		"error",
		"class",
		"containerClass",
		"labelClass",
		"errorClass",
		"required",
		"disabled",
		"readonly",
	]);

	return (
		<fieldset class="fieldset">
			<label class="label">
				<input
					{...checkboxProps}
					id={props.name}
					checked={!!props.checked}
					type="checkbox"
					class="checkbox"
					classList={{ "checkbox-error": !!props.error }}
					aria-invalid={!!props.error}
					aria-describedby={props.error ? `${props.name}-error` : undefined}
					aria-errormessage={props.error ? `${props.name}-error` : undefined}
				/>
				{props.label}
			</label>
			{props.error && <p class="legend text-error">{props.error}</p>}
		</fieldset>
	);
};

export default Checkbox;
