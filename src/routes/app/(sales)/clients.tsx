import { Title } from "@solidjs/meta";
import { FaSolidPlus } from "solid-icons/fa";
import { createSignal, For } from "solid-js";
import DashboardLayout from "~/components/layout/Dashboard";

interface Cliente {
	id: string;
	nombre: string;
	ruc: string;
	email: string;
	telefono: string;
	status: boolean;
}

const ClientsPage = () => {
	const [clientes, setClientes] = createSignal<Cliente[]>([
		// Example data - in real app this would come from Appwrite
	]);

	return (
		<>
			<Title>Clientes - Grafos</Title>
			<DashboardLayout>
				<div>
					<div class="flex justify-between items-center">
						<h1 class="text-3xl font-bold">Gestión de Clientes</h1>
						<button type="button" class="btn btn-primary">
							<FaSolidPlus size={16} />
							Nuevo
						</button>
					</div>

					{/* Search and Filter */}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<div class="flex gap-4">
								<div class="form-control flex-1">
									<input
										type="text"
										placeholder="Buscar cliente..."
										class="input input-bordered"
									/>
								</div>
								<button class="btn btn-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>

					{/* Table */}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<h2 class="card-title">Lista de Clientes</h2>

							<div class="overflow-x-auto">
								<table class="table table-zebra">
									<thead>
										<tr>
											<th>Nombre</th>
											<th>RUC</th>
											<th>Email</th>
											<th>Teléfono</th>
											<th>Estado</th>
											<th>Acciones</th>
										</tr>
									</thead>
									<tbody>
										<For
											each={clientes()}
											fallback={
												<tr>
													<td colspan="6" class="text-center py-8">
														No hay clientes registrados. Haz clic en "Nuevo
														Cliente" para crear uno.
													</td>
												</tr>
											}
										>
											{(cliente) => (
												<tr>
													<td>{cliente.nombre}</td>
													<td>{cliente.ruc}</td>
													<td>{cliente.email}</td>
													<td>{cliente.telefono}</td>
													<td>
														<span
															class={
																cliente.status
																	? "badge badge-success"
																	: "badge badge-error"
															}
														>
															{cliente.status ? "Activo" : "Inactivo"}
														</span>
													</td>
													<td>
														<div class="join">
															<button class="btn btn-sm join-item">Ver</button>
															<button class="btn btn-sm join-item">
																Editar
															</button>
															<button class="btn btn-sm btn-error join-item">
																Eliminar
															</button>
														</div>
													</td>
												</tr>
											)}
										</For>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</>
	);
};

export default ClientsPage;
