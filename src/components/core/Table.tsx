import type { ParentComponent } from "solid-js";
import { For, type JSX, Show } from "solid-js";

interface IHeader {
	label: string;
	class?: string;
}

interface IProps {
	headers: Array<IHeader>;
	footer?: JSX.Element;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Table: ParentComponent<IProps> = (props) => {
	return (
		<div class="overflow-x-auto">
			<table
				class="table table-zebra w-full"
				classList={{
					"table-xs": props.size === "xs",
					"table-sm": props.size === "sm",
					"table-md": !props.size || props.size === "md",
					"table-lg": props.size === "lg",
					"table-xl": props.size === "xl",
				}}
			>
				<thead>
					<tr>
						<For each={props.headers}>
							{(item) => <th class={item.class}>{item.label}</th>}
						</For>
					</tr>
				</thead>
				<tbody>{props.children}</tbody>
				<Show when={props.footer}>
					<tfoot>{props.footer}</tfoot>
				</Show>
			</table>
		</div>
	);
};

export default Table;
