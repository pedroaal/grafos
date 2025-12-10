import { Title } from "@solidjs/meta";
import MainLayout from "~/components/layout/Main";

const Home = () => {
	return (
		<>
			<Title>ServiGraf</Title>

			<MainLayout>
				<div class="hero min-h-full bg-base-200">
					<div class="hero-content text-center">
						<div class="max-w-md">
							<h1 class="text-5xl font-bold">ServiGraf V2</h1>
							<p class="py-6">
								Sistema ERP migrado de Laravel + Bootstrap a SolidStart +
								Appwrite + DaisyUI
							</p>
							<div class="space-x-4">
								<a href="/login" class="btn btn-primary">
									Iniciar Sesión
								</a>
								<a href="/register" class="btn btn-secondary">
									Registrarse
								</a>
							</div>
						</div>
					</div>
				</div>
			</MainLayout>
		</>
	);
};

export default Home;
