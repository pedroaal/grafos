import { Title } from "@solidjs/meta";
import DashboardLayout from "~/components/layouts/Dashboard";

const DashboardPage = () => {
	return (
		<>
			<Title>Dashboard - Grafos</Title>
			<DashboardLayout>
				<div>
					<div class="flex justify-between items-center">
						<h1 class="text-3xl font-bold">Dashboard</h1>
					</div>
				</div>
			</DashboardLayout>
		</>
	);
};

export default DashboardPage;
