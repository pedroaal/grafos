import { Title } from "@solidjs/meta";
import { createEffect, createResource, For } from "solid-js";
import { CostCenterModal } from "~/components/accounting/CostCenterModal";
import { TaxModal } from "~/components/accounting/TaxModal";
import { WithholdingModal } from "~/components/accounting/WithholdingModal";
import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";
import TrueFalse from "~/components/core/TrueFalse";

import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import {
	deleteCostCenter,
	listCostCenters,
} from "~/services/accounting/costCenters";
import { deleteTax, listTaxes } from "~/services/accounting/taxes";
import {
	deleteWithholding,
	listWithholdings,
} from "~/services/accounting/withholdings";

const WITHHOLDING_TYPE_LABELS: Record<string, string> = {
	tax: "Impuesto",
	source: "Fuente",
};

const TaxesPage = () => {
	const { addAlert, openModal } = useApp();

	const taxesPagination = usePagination();
	const withholdingsPagination = usePagination();
	const costCentersPagination = usePagination();

	const [taxes, { refetch: refetchTaxes }] = createResource(
		() => ({
			page: taxesPagination.page(),
			perPage: taxesPagination.perPage(),
		}),
		listTaxes,
	);
	const [withholdings, { refetch: refetchWithholdings }] = createResource(
		() => ({
			page: withholdingsPagination.page(),
			perPage: withholdingsPagination.perPage(),
		}),
		listWithholdings,
	);
	const [costCenters, { refetch: refetchCostCenters }] = createResource(
		() => ({
			page: costCentersPagination.page(),
			perPage: costCentersPagination.perPage(),
		}),
		listCostCenters,
	);

	createEffect(() => {
		const data = taxes();
		if (data) {
			taxesPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = withholdings();
		if (data) {
			withholdingsPagination.setTotalItems(data.total);
		}
	});

	createEffect(() => {
		const data = costCenters();
		if (data) {
			costCentersPagination.setTotalItems(data.total);
		}
	});

	const editRow = (modalId: string, id: string) => {
		openModal(modalId, { id });
	};

	const handleTaxDelete = async (taxId: string, percentage: number) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el impuesto del ${percentage}%?`,
		);
		if (!confirm) return;

		try {
			await deleteTax(taxId);
			addAlert({ type: "success", message: "Impuesto eliminado con éxito" });
			refetchTaxes();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar impuesto",
			});
		}
	};

	const handleWithholdingDelete = async (
		withholdingId: string,
		description: string,
	) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar la retención "${description}"?`,
		);
		if (!confirm) return;

		try {
			await deleteWithholding(withholdingId);
			addAlert({ type: "success", message: "Retención eliminada con éxito" });
			refetchWithholdings();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar retención",
			});
		}
	};

	const handleCostCenterDelete = async (costCenterId: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el centro de costos "${name}"?`,
		);
		if (!confirm) return;

		try {
			await deleteCostCenter(costCenterId);
			addAlert({
				type: "success",
				message: "Centro de costos eliminado con éxito",
			});
			refetchCostCenters();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar centro de costos",
			});
		}
	};

	return (
		<>
			<Title>Impuestos - Grafos</Title>
			<Breadcrumb links={[{ label: "Contabilidad" }, { label: "Impuestos" }]} />
			<BlueBoard
				title="Impuestos"
				modals={[
					{
						key: Modals.Tax,
						label: "Nuevo Impuesto",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Porcentaje" },
						{ label: "Activo" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={taxes()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.percentage}%</td>
								<td>
									<TrueFalse value={item.active} />
								</td>
								<td>
									<RowActions
										onEdit={() => editRow(Modals.Tax, item.$id)}
										onDelete={() => handleTaxDelete(item.$id, item.percentage)}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={taxesPagination.page()}
					totalPages={taxesPagination.totalPages()}
					totalItems={taxesPagination.totalItems()}
					perPage={taxesPagination.perPage()}
					onPageChange={taxesPagination.setPage}
					onPerPageChange={taxesPagination.setPerPage}
				/>
			</BlueBoard>
			<BlueBoard
				title="Retenciones"
				modals={[
					{
						key: Modals.Withholding,
						label: "Nueva Retención",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Descripción" },
						{ label: "Porcentaje" },
						{ label: "Tipo" },
						{ label: "Activo" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={withholdings()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.description}</td>
								<td>{item.percentage}%</td>
								<td>{WITHHOLDING_TYPE_LABELS[item.type] || item.type}</td>
								<td>
									<TrueFalse value={item.active} />
								</td>
								<td>
									<RowActions
										onEdit={() => editRow(Modals.Withholding, item.$id)}
										onDelete={() =>
											handleWithholdingDelete(item.$id, item.description)
										}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={withholdingsPagination.page()}
					totalPages={withholdingsPagination.totalPages()}
					totalItems={withholdingsPagination.totalItems()}
					perPage={withholdingsPagination.perPage()}
					onPageChange={withholdingsPagination.setPage}
					onPerPageChange={withholdingsPagination.setPerPage}
				/>
			</BlueBoard>
			<BlueBoard
				title="Centros de Costos"
				modals={[
					{
						key: Modals.CostCenter,
						label: "Nuevo Centro de Costos",
					},
				]}
			>
				<Table headers={[{ label: "Nombre" }, { label: "", class: "w-1/12" }]}>
					<For each={costCenters()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.name}</td>
								<td>
									<RowActions
										onEdit={() => editRow(Modals.CostCenter, item.$id)}
										onDelete={() => handleCostCenterDelete(item.$id, item.name)}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={costCentersPagination.page()}
					totalPages={costCentersPagination.totalPages()}
					totalItems={costCentersPagination.totalItems()}
					perPage={costCentersPagination.perPage()}
					onPageChange={costCentersPagination.setPage}
					onPerPageChange={costCentersPagination.setPerPage}
				/>
			</BlueBoard>
			<TaxModal onSuccess={() => refetchTaxes()} />
			<WithholdingModal onSuccess={() => refetchWithholdings()} />
			<CostCenterModal onSuccess={() => refetchCostCenters()} />
		</>
	);
};

export default TaxesPage;
