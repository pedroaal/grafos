import { Title } from "@solidjs/meta";
import DashboardLayout from "~/components/layout/Dashboard";

const DashboardPage = () => {
	return (
		<>
			<Title>Dashboard - Grafos</Title>

			<DashboardLayout>
				<div class="space-y-6">
					<div class="flex justify-between items-center">
						<h1 class="text-3xl font-bold">Dashboard</h1>
						<button class="btn btn-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Nuevo Cliente
						</button>
					</div>
				</div>
			</DashboardLayout>
		</>
	);
};

export default DashboardPage;
