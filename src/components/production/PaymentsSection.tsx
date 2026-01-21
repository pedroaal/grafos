import type { Models } from "appwrite";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Accessor, type Component, For, type Setter } from "solid-js";

import Input from "~/components/core/Input";
import Table from "~/components/core/Table";

import type { OrderPayments } from "~/types/appwrite";

interface IProps {
	state: Accessor<Array<PaymentForm>>;
	setState: Setter<Array<PaymentForm>>;
	balance: Accessor<number>;
}

export type PaymentForm = Omit<
	OrderPayments,
	keyof Models.Row | "orderId" | "userId"
>;

const paymentDefault: PaymentForm = {
	date: "",
	method: "",
	amount: 0,
};

const PaymentsSection: Component<IProps> = (props) => {
	const total = () =>
		props.state().reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

	const add = (current?: Partial<PaymentForm>) =>
		props.setState((prev) => [
			...prev,
			{
				...paymentDefault,
				...current,
			},
		]);

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

	const update = (idx: number, patch: Partial<PaymentForm>) =>
		props.setState((prev) =>
			prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
		);

	return (
		<div class="mt-6">
			<div class="flex gap-2">
				<h6 class="font-semibold grow">Abonos</h6>
				<button
					type="button"
					class="btn btn-sm btn-ghost"
					onClick={[props.setState, []]}
				>
					<FaSolidTrashCan size={16} />
				</button>
				<button type="button" class="btn btn-sm" onClick={[add, {}]}>
					<FaSolidPlus size={16} />
				</button>
			</div>
			<Table
				headers={[
					{ label: "" },
					{ label: "Fecha" },
					{ label: "Forma de pago" },
					{ label: "Valor $", class: "text-right" },
				]}
				footer={
					<>
						<tr>
							<td colspan={3} class="text-right font-bold">
								Abonos $
							</td>
							<td class="text-right font-bold">{total().toFixed(4)}</td>
						</tr>
						<tr>
							<td colspan={3} class="text-right font-bold">
								Saldo $
							</td>
							<td class="text-right font-bold">{props.balance().toFixed(4)}</td>
						</tr>
					</>
				}
			>
				<For each={props.state()}>
					{(item, idx) => (
						<tr>
							<td>
								<button
									type="button"
									class="btn btn-ghost btn-sm"
									onClick={() => remove(idx())}
								>
									<FaSolidXmark size={16} />
								</button>
							</td>
							<td>
								<Input
									name="date"
									type="date"
									value={item.date || ""}
									onInput={(e) =>
										update(idx(), {
											date: (e.target as HTMLInputElement).value,
										})
									}
								/>
							</td>
							<td>
								<Input
									name="method"
									type="text"
									value={item.method || ""}
									onInput={(e) =>
										update(idx(), {
											method: (e.target as HTMLInputElement).value,
										})
									}
								/>
							</td>
							<td>
								<Input
									name="amount"
									type="number"
									step="0.0001"
									value={item.amount || 0}
									onInput={(e) =>
										update(idx(), {
											amount: Number((e.target as HTMLInputElement).value),
										})
									}
								/>
							</td>
						</tr>
					)}
				</For>
			</Table>
		</div>
	);
};

export default PaymentsSection;
