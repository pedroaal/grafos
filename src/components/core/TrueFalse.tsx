import { FaSolidCheck, FaSolidXmark } from "solid-icons/fa";
import { type Component, Show } from "solid-js";

interface IProps {
	value: boolean;
	color?: boolean;
}

const TrueFalse: Component<IProps> = (props) => {
	return (
		<Show
			when={props.value}
			fallback={
				<FaSolidXmark size={16} classList={{ "text-danger": props.color }} />
			}
		>
			<FaSolidCheck size={16} classList={{ "text-success": props.color }} />
		</Show>
	);
};

export default TrueFalse;
