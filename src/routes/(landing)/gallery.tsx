import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import LandingLayout from "~/components/layout/Landing";

const GalleryPage = () => {
	const images = [
		{ id: 1, name: "Máquina 46" },
		{ id: 2, name: "Máquina 52x2-1" },
		{ id: 3, name: "Máquina 52x2-2" },
		{ id: 4, name: "Máquina 52x2-3" },
		{ id: 5, name: "Área de trabajo 1" },
		{ id: 6, name: "Guillotina 1" },
		{ id: 7, name: "Guillotina 2" },
		{ id: 8, name: "Redondeadora 1" },
		{ id: 9, name: "Redondeadora 2" },
		{ id: 10, name: "Grapadora" },
		{ id: 11, name: "Perforadora" },
		{ id: 12, name: "Entrada" },
	];

	return (
		<>
			<Title>Gallery - Grafos</Title>
			<LandingLayout>
				<div>
					<div
						class="hero min-h-[400px] relative"
						style="background-image: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200');"
					>
						<div class="hero-overlay bg-black bg-opacity-40"></div>
						<div class="hero-content text-center text-white">
							<h1 class="text-5xl font-bold">Galería</h1>
						</div>
					</div>

					<div class="container mx-auto px-4 py-16 max-w-6xl">
						<h2 class="text-4xl font-bold text-center text-blue-600 mb-12">
							Infraestructura
						</h2>

						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							<For each={images}>
								{(image) => (
									<div class="card bg-base-100 shadow-xl hover:scale-105 transition-transform">
										<figure class="h-64 bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
											<div class="text-center p-6">
												<div class="text-6xl mb-4">🖨️</div>
												<p class="text-gray-700 font-semibold">{image.name}</p>
											</div>
										</figure>
									</div>
								)}
							</For>
						</div>
					</div>
				</div>
			</LandingLayout>
		</>
	);
};

export default GalleryPage;
