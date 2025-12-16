import { Title } from "@solidjs/meta";
import { A, useNavigate } from "@solidjs/router";
import { createRenderEffect, createSignal } from "solid-js";
import LandingLayout from "~/components/layout/Landing";
import { Routes } from "~/config/routes";
import { useAuth } from "~/context/auth";

const LoginPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const { authStore, login, getAuth } = useAuth();

	createRenderEffect(() => {
		if (authStore.session) navigate(Routes.dashboard);
		getAuth({ navigateOnSuccess: true });
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		await login(email(), password());
	};

	return (
		<>
			<Title>Login - Grafos</Title>
			<LandingLayout>
				<div class="hero h-full">
					<div class="hero-content">
						<div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
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
									<A href="#" class="label label-text-alt link link-hover">
										¿Olvidaste tu contraseña?
									</A>
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
			</LandingLayout>
		</>
	);
};

export default LoginPage;
