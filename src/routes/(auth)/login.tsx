import { createForm, type SubmitHandler, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { A, createAsync } from "@solidjs/router";
import { object, string } from "valibot";

import Input from "~/components/core/Input";
import LandingLayout from "~/components/layouts/Landing";

import { login } from "~/services/auth/login";
import { requireGuest } from "~/services/auth/session";

type LoginForm = {
	email: string;
	password: string;
};

const LoginSchema = object({
	email: string(),
	password: string(),
});

const LoginPage = () => {
	createAsync(() => requireGuest());

	const [_form, { Form, Field }] = createForm<LoginForm>({
		validate: valiForm(LoginSchema),
		initialValues: {
			email: "",
			password: "",
		},
	});

	return (
		<>
			<Title>Login - Grafos</Title>
			<LandingLayout>
				<div class="flex h-full w-full justify-center items-center">
					<div class="card w-full max-w-md shadow-lg bg-base-100">
						<Form class="card-body" method="post" action={login}>
							<h2 class="card-title justify-center">Iniciar Sesión</h2>
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
							<div class="card-actions justify-end">
								<button type="submit" class="btn btn-primary">
									Iniciar Sesión
								</button>
							</div>
						</Form>
					</div>
				</div>
			</LandingLayout>
		</>
	);
};

export default LoginPage;
