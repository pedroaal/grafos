import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import LandingLayout from "~/components/layouts/Landing";

const ServicesPage = () => {
	const services = [
		{
			title: "GTO 46",
			description:
				"Formato: 45 x 32.5, monocolor\nImpresión, numerados, perforados.",
			icon: "🖨️",
		},
		{
			title: "GTO 52",
			description: "Formato: 50 x 35, bicolor\nImpresión.",
			icon: "🖨️",
		},
		{
			title: "Guillotina Polar",
			description: "Formato: 80cm",
			icon: "✂️",
		},
		{
			title: "Colores Pantone",
			description: "Preparamos colores pantone.",
			icon: "🎨",
		},
		{
			title: "Terminados Gráficos",
			description: "Servicios de acabado profesional.",
			icon: "📋",
		},
		{
			title: "Redondeadora",
			description: "Esquinas redondeadas profesionales.",
			icon: "⭕",
		},
		{
			title: "Grapadora",
			description: "Grapado industrial.",
			icon: "📎",
		},
		{
			title: "Perforados",
			description: "Perforado de documentos.",
			icon: "🔘",
		},
	];

	return (
		<>
			<Title>Services - Grafos</Title>
			<LandingLayout>
				<div>
					<div
						class="hero min-h-[400px] relative"
						style="background-image: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200');"
					>
						<div class="hero-overlay bg-black bg-opacity-40"></div>
						<div class="hero-content text-center text-white">
							<h1 class="text-5xl font-bold">Servicios</h1>
						</div>
					</div>

					<div class="container mx-auto px-4 py-16 max-w-6xl">
						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							<For each={services}>
								{(service) => (
									<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow h-64">
										<div class="card-body">
											<div class="flex items-start gap-4">
												<div class="text-5xl">{service.icon}</div>
												<h2 class="card-title text-blue-600">
													{service.title}
												</h2>
											</div>
											<p class="text-gray-600 whitespace-pre-line mt-4">
												{service.description}
											</p>
										</div>
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

export default ServicesPage;
