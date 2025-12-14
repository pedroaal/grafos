import { Title } from "@solidjs/meta";
import MainLayout from "~/components/layout/Main";

const HomePage = () => {
	return (
		<>
			<Title>ServiGraf</Title>

			<MainLayout>
				<div class="hero h-full">
					<div class="hero-content text-center">
						<div class="max-w-2xl">
							<div class="mb-8">
								<div class="text-6xl font-bold text-blue-600 mb-4">
									<span class="font-extrabold">Grafos</span>
								</div>
							</div>
							<h3 class="text-2xl text-gray-500">
								Diseño gráfico & impresión offset
							</h3>
						</div>
					</div>
				</div>
			</MainLayout>
		</>
	);
};

export default HomePage;
