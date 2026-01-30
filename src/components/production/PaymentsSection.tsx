import type { Models } from "appwrite";
import dayjs from "dayjs";
import { FaSolidPlus, FaSolidTrashCan, FaSolidXmark } from "solid-icons/fa";
import { type Component, For } from "solid-js";
import type { Part, SetStoreFunction } from "solid-js/store";
import Input from "~/components/core/Input";
import Table from "~/components/core/Table";
import { makeId } from "~/lib/appwrite";
import type { OrderPayments } from "~/types/appwrite";
import type { ITotals } from "~/types/orders";
import Select from "../core/Select";

interface IProps {
	state: PaymentForm[];
	setState: SetStoreFunction<PaymentForm[]>;
	totals: ITotals;
	setTotals: SetStoreFunction<ITotals>;
}

export type PaymentForm = Omit<
	OrderPayments,
	keyof Models.Row | "orderId" | "userId"
> & { $id: string };

const paymentDefault: PaymentForm = {
	$id: "",
	date: dayjs().format("YYYY-MM-DD"),
	method: "",
	amount: 0,
};

const PaymentsSection: Component<IProps> = (props) => {
	const add = () =>
		props.setState(props.state.length, { ...paymentDefault, $id: makeId() });

	const update = (
		id: string,
		col: Part<PaymentForm>,
		value: string | number,
	) => {
		props.setState(
			(item) => item.$id === id,
			col,
			() => value,
		);

		props.setTotals((prev) => {
			const total = props.state.reduce(
				(sum, item) => sum + (Number(item.amount) || 0),
				0,
			);
			return {
				...prev,
				payments: total,
				balance: prev.processes - total,
			};
		});
	};

	const remove = (idx: number) =>
		props.setState((prev) => prev.filter((_, i) => i !== idx));

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
				size="xs"
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
							<td class="text-right font-bold">
								{props.totals.payments.toFixed(2)}
							</td>
						</tr>
						<tr>
							<td colspan={3} class="text-right font-bold">
								Saldo $
							</td>
							<td class="text-right font-bold">
								{props.totals.balance.toFixed(2)}
							</td>
						</tr>
					</>
				}
			>
				<For each={props.state}>
					{(item, idx) => (
						<tr>
							<td class="w-4">
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
										update(
											item.$id,
											"date",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Select
									options={[
										{
											label: "Efectivo",
											key: "cash",
										},
										{
											label: "Transferencia bancaria",
											key: "bank_transfer",
										},
									]}
									name="method"
									value={item.method || ""}
									onChange={(e) =>
										update(
											item.$id,
											"method",
											(e.target as HTMLInputElement).value,
										)
									}
								/>
							</td>
							<td>
								<Input
									name="amount"
									type="number"
									step="0.01"
									value={item.amount || 0}
									onInput={(e) =>
										update(
											item.$id,
											"amount",
											Number((e.target as HTMLInputElement).value),
										)
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
