import type { ParentComponent } from "solid-js";
import { For, type JSX, Show } from "solid-js";

interface IHeader {
	label: string;
	class?: string;
}

interface IProps {
	headers: Array<IHeader>;
	footer?: JSX.Element;
}

const Table: ParentComponent<IProps> = (props) => {
	return (
		<div class="overflow-x-auto">
			<table class="table table-zebra">
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
