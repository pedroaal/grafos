import type { Component, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

interface IProps {
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	value?: string;
	name: string;
	error?: string;
	rows?: number;
	ref?: (element: HTMLTextAreaElement) => void;
	onInput?: JSX.EventHandler<HTMLTextAreaElement, InputEvent>;
	onChange?: JSX.EventHandler<HTMLTextAreaElement, Event>;
	onBlur?: JSX.EventHandler<HTMLTextAreaElement, FocusEvent>;
}

const Textarea: Component<IProps> = (props) => {
	const [, textareaProps] = splitProps(props, ["label", "error"]);

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
			<textarea
				{...textareaProps}
				id={props.name}
				class="textarea textarea-bordered w-full"
				classList={{ "textarea-error": !!props.error }}
				aria-invalid={!!props.error}
				aria-describedby={props.error ? `${props.name}-error` : undefined}
				aria-errormessage={props.error ? `${props.name}-error` : undefined}
				rows={props.rows || 4}
			/>
			<Show when={props.error}>
				<p class="label text-error">{props.error}</p>
			</Show>
		</fieldset>
	);
};

export default Textarea;
