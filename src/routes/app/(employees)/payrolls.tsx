import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import dayjs from "dayjs";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";

import { AppRoutes } from "~/config/routes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deletePayroll, listPayrolls } from "~/services/employees/payroll";

const PayrollsPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();

	const pagination = usePagination();

	const [payrolls, { refetch }] = createResource(
		() => ({
			page: pagination.page(),
			perPage: pagination.perPage(),
		}),
		listPayrolls,
	);

	createEffect(() => {
		const data = payrolls();
		if (data) {
			pagination.setTotalItems(data.total);
		}
	});

	const handleEdit = (id: string) => {
		nav(`${AppRoutes.payroll}/${id}`);
	};

	const handleDelete = async (id: string, name: string) => {
		const confirm = window.confirm(
			`¿Está seguro de eliminar el empleado "${name}"?`,
		);
		if (!confirm) return;

		try {
			await deletePayroll(id);
			addAlert({ type: "success", message: "Empleado eliminado con éxito" });
			refetch();
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al eliminar empleado",
			});
		}
	};

	return (
		<>
			<Title>Nómina - Grafos</Title>
			<Breadcrumb links={[{ label: "Empleados" }, { label: "Nómina" }]} />
			<BlueBoard
				title="Gestionar Empleados"
				links={[
					{
						href: AppRoutes.payroll,
						label: "Nuevo Empleado",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Cédula" },
						{ label: "Nombre" },
						{ label: "Cargo" },
						{ label: "Fecha Contratación" },
						{ label: "Salario" },
						{ label: "Estado" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={payrolls()?.rows || []}>
						{(item) => (
							<tr>
								<td>{item.idNumber}</td>
								<td>
									{item.firstName} {item.lastName}
								</td>
								<td>{item.position}</td>
								<td>{dayjs(item.hireDate).format("DD/MM/YYYY")}</td>
								<td>${item.salary.toFixed(2)}</td>
								<td>
									<span
										class={
											item.active ? "badge badge-success" : "badge badge-error"
										}
									>
										{item.active ? "Activo" : "Inactivo"}
									</span>
								</td>
								<td>
									<RowActions
										onEdit={() => handleEdit(item.$id)}
										onDelete={() =>
											handleDelete(
												item.$id,
												`${item.firstName} ${item.lastName}`,
											)
										}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={pagination.page()}
					totalPages={pagination.totalPages()}
					totalItems={pagination.totalItems()}
					perPage={pagination.perPage()}
					onPageChange={pagination.setPage}
					onPerPageChange={pagination.setPerPage}
				/>
			</BlueBoard>
		</>
	);
};

export default PayrollsPage;
