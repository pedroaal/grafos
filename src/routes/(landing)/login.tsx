import { createForm, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { onMount } from "solid-js";
import { object, string } from "valibot";

import Input from "~/components/core/Input";
import { useAuth } from "~/context/auth";

import type { LoginForm } from "~/types/login";

const LoginSchema = object({
	email: string(),
	password: string(),
});

const LoginPage = () => {
	const { login, logout, checkGuest } = useAuth();

	onMount(() => {
		checkGuest();
	});

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
			<div class="flex h-full w-full justify-center items-center">
				<div class="card w-full max-w-md shadow-lg bg-base-100">
					<Form
						class="card-body"
						onSubmit={(values) => login(values.email, values.password)}
					>
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
							<button type="button" class="btn btn-secondary" onClick={logout}>
								Cerrar Sesión
							</button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
