import { Title } from "@solidjs/meta";
import LandingLayout from "~/components/layout/Landing";

const AboutPage = () => {
	return (
		<>
			<Title>About - Grafos</Title>
			<LandingLayout>
				<div>
					<div
						class="hero min-h-[400px] relative"
						style="background-image: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200');"
					>
						<div class="hero-overlay bg-black bg-opacity-40"></div>
						<div class="hero-content text-center text-white">
							<h1 class="text-5xl font-bold">Sobre Nosotros</h1>
						</div>
					</div>

					<div class="container mx-auto px-4 py-16 max-w-6xl">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							<div class="flex justify-center">
								<div class="w-full max-w-md">
									<div class="text-6xl font-bold text-blue-600 text-center">
										<span class="font-extrabold">Servi</span>Graf
									</div>
								</div>
							</div>

							<div>
								<h1 class="text-4xl font-bold text-blue-600 mb-6">
									Servicios Gráficos
								</h1>
								<p class="text-gray-600 text-justify mb-6 leading-relaxed">
									Con presencia en el mercado desde el año 2000, nos hemos
									convertido en una empresa sólida y creciente en el área
									gráfica, preocupados siempre por mejorar nuestros procesos a
									fin de entregar un servicio de alta calidad, de acuerdo a las
									exigencias del mercado actual.
								</p>
								<p class="text-gray-600 text-justify mb-6 leading-relaxed">
									La experiencia de nuestro personal y su permanente
									capacitación nos han mantenido siempre actualizados en el
									constante avance tecnológico.
								</p>
								<p class="text-gray-600 text-justify mb-8 leading-relaxed">
									Contamos con la infraestructura necesaria para desarrollar sus
									proyectos gráficos, más una respuesta rápida y de excelente
									calidad, nos ha significado el reconocimiento de nuestros
									clientes.
								</p>

								<div class="card bg-blue-50 p-6">
									<h5 class="font-bold text-gray-700">Samuel Altamirano</h5>
									<h5 class="text-gray-600">Gerente</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</LandingLayout>
		</>
	);
};

export default AboutPage;
