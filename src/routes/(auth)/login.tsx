import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import MainLayout from "~/components/layout/Main";
import { useAuth } from "~/context/auth";

const LoginPage = () => {
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const { login } = useAuth();

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		await login(email(), password());
	};

	return (
		<>
			<Title>Login - Grafos</Title>
			<MainLayout>
				<div class="hero min-h-screen">
					<div class="hero-content flex-col md:flex-row-reverse">
						<div class="text-center md:text-left">
							<h1 class="text-5xl font-bold">Iniciar Sesión</h1>
							<p class="py-6">Accede al sistema ERP Grafos</p>
						</div>
						<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
							<form class="card-body" onSubmit={handleSubmit}>
								<div class="form-control">
									<label class="label">
										<span class="label-text">Email</span>
										<input
											type="email"
											placeholder="email@ejemplo.com"
											class="input input-bordered"
											value={email()}
											onInput={(e) => setEmail(e.currentTarget.value)}
											required
										/>
									</label>
								</div>
								<div class="form-control">
									<label class="label">
										<span class="label-text">Contraseña</span>
										<input
											type="password"
											placeholder="contraseña"
											class="input input-bordered"
											value={password()}
											onInput={(e) => setPassword(e.currentTarget.value)}
											required
										/>
									</label>
									<label class="label">
										<a href="#" class="label-text-alt link link-hover">
											¿Olvidaste tu contraseña?
										</a>
									</label>
								</div>
								<div class="form-control mt-6">
									<button type="submit" class="btn btn-primary">
										Iniciar Sesión
									</button>
								</div>
								<div class="divider">O</div>
								<div class="text-center">
									<A href="/register" class="link link-primary">
										¿No tienes cuenta? Regístrate
									</A>
								</div>
							</form>
						</div>
					</div>
				</div>
			</MainLayout>
		</>
	);
};

export default LoginPage;
