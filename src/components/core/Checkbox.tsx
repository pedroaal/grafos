import type { Component } from "solid-js";
import { type JSX, splitProps } from "solid-js";

interface IProps {
	label?: string;
	checked?: boolean;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	name: string;
	error?: string;
	autofocus?: boolean;
	ref: (element: HTMLInputElement) => void;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
}

const Checkbox: Component<IProps> = (props) => {
	const [, checkboxProps] = splitProps(props, ["label", "error"]);

	return (
		<fieldset class="fieldset">
			<label class="label">
				<input
					{...checkboxProps}
					id={props.name}
					type="checkbox"
					class="checkbox"
					classList={{ "checkbox-error": !!props.error }}
					aria-invalid={!!props.error}
					aria-describedby={props.error ? `${props.name}-error` : undefined}
					aria-errormessage={props.error ? `${props.name}-error` : undefined}
				/>
				{props.label}
				{props.required && <span class="required">*</span>}
			</label>
			{props.error && <p class="legend text-error">{props.error}</p>}
		</fieldset>
	);
};

export default Checkbox;
