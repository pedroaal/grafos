import { createForm, type SubmitHandler } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { A, useNavigate } from "@solidjs/router";
import { createRenderEffect } from "solid-js";
import Input from "~/components/core/Input";
import LandingLayout from "~/components/layout/Landing";
import { Routes } from "~/config/routes";
import { useAuth } from "~/context/auth";

type LoginForm = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const navigate = useNavigate();
	const { authStore, login, getAuth } = useAuth();

	createRenderEffect(() => {
		if (authStore.session) navigate(Routes.dashboard);
		getAuth({ navigateOnSuccess: true });
	});

	const [_form, { Form, Field }] = createForm<LoginForm>({
		initialValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit: SubmitHandler<LoginForm> = (values, e) => {
		e.preventDefault();
		login(values.email, values.password);
	};

	return (
		<>
			<Title>Login - Grafos</Title>
			<LandingLayout>
				<div class="hero h-full">
					<div class="hero-content">
						<div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
							<Form class="card-body" onSubmit={handleSubmit}>
								<Field name="email">
									{(field, props) => (
										<Input
											{...props}
											type="email"
											label="Email"
											placeholder="email@ejemplo.com"
											value={field.value}
											error={field.error}
										/>
									)}
								</Field>
								<Field name="password">
									{(field, props) => (
										<Input
											{...props}
											type="password"
											label="Contraseña"
											value={field.value}
											error={field.error}
										/>
									)}
								</Field>
								<A href="#" class="label label-text-alt link link-hover">
									¿Olvidaste tu contraseña?
								</A>
								<div class="form-control mt-6">
									<button type="submit" class="btn btn-primary">
										Iniciar Sesión
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</LandingLayout>
		</>
	);
};

export default LoginPage;
