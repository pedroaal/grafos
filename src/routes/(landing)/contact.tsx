import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import LandingLayout from "~/components/layout/Landing";

const ContactPage = () => {
	const [formData, setFormData] = createSignal({
		nombre: "",
		email: "",
		asunto: "",
		mensaje: "",
	});
	const [showSuccess, setShowSuccess] = createSignal(false);

	const handleSubmit = () => {
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 3000);
		setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
	};

	const updateField = (field, value) => {
		setFormData({ ...formData(), [field]: value });
	};

	return (
		<>
			<Title>Contact - Grafos</Title>
			<LandingLayout>
				<div>
					<div
						class="hero min-h-[400px] relative"
						style="background-image: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200');"
					>
						<div class="hero-overlay bg-black bg-opacity-40"></div>
						<div class="hero-content text-center text-white">
							<h1 class="text-5xl font-bold">Contáctenos</h1>
						</div>
					</div>

					<div class="container mx-auto px-4 py-16 max-w-6xl">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
							{/* Contact Section */}
							<div>
								<h1 class="text-4xl font-bold text-blue-600 mb-6">
									Contáctanos
								</h1>
								<h4 class="text-xl mb-6 text-gray-700">¿Tienes preguntas?</h4>

								<Show when={showSuccess()}>
									<div class="alert alert-success mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="stroke-current shrink-0 h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>Mensaje enviado exitosamente!</span>
									</div>
								</Show>

								<div>
									<input
										type="text"
										placeholder="Nombre"
										class="input input-bordered w-full"
										value={formData().nombre}
										onInput={(e) => updateField("nombre", e.target.value)}
									/>
									<input
										type="email"
										placeholder="Email"
										class="input input-bordered w-full"
										value={formData().email}
										onInput={(e) => updateField("email", e.target.value)}
									/>
									<input
										type="text"
										placeholder="Asunto"
										class="input input-bordered w-full"
										value={formData().asunto}
										onInput={(e) => updateField("asunto", e.target.value)}
									/>
									<textarea
										placeholder="Mensaje"
										class="textarea textarea-bordered w-full h-32"
										value={formData().mensaje}
										onInput={(e) => updateField("mensaje", e.target.value)}
									></textarea>
									<button class="btn btn-primary w-full" onClick={handleSubmit}>
										Enviar
									</button>
								</div>
							</div>

							{/* Contact Info */}
							<div>
								<h1 class="text-4xl font-bold text-blue-600 mb-6">
									<span class="font-extrabold">Servi</span>Graf
								</h1>

								<div class="text-gray-700">
									<div class="flex items-start gap-3">
										<svg
											class="w-6 h-6 mt-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<div>
											<p class="font-semibold">
												Atención de Lunes a Viernes de:
											</p>
											<p>9:00 a 13:00 & 14:00 a 18:00</p>
										</div>
									</div>

									<div class="flex items-center gap-3">
										<svg
											class="w-6 h-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										<p>Uruguay N16.66 y Rio de Janeiro</p>
									</div>

									<div class="flex items-center gap-3">
										<svg
											class="w-6 h-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
										<p>514 3236 | WhatsApp: 096 939 891</p>
									</div>

									<div class="flex items-center gap-3">
										<svg
											class="w-6 h-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										<p>info@servigraf.me</p>
									</div>

									<div class="flex items-center gap-3">
										<svg
											class="w-6 h-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
											/>
										</svg>
										<p>Efectivo | Transferencias | PayPal</p>
									</div>

									<div class="flex items-center gap-3">
										<svg
											class="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
										</svg>
										<a
											href="https://www.facebook.com/ServiGraf-281911858984024/"
											target="_blank"
											class="link link-primary"
											rel="noopener"
										>
											Visítanos en Facebook
										</a>
									</div>
								</div>

								<div class="mt-8">
									<div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
										<div class="text-center">
											<svg
												class="w-16 h-16 mx-auto text-gray-400 mb-2"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											<p class="text-gray-500">Mapa de ubicación</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</LandingLayout>
		</>
	);
};

export default ContactPage;
