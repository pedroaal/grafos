import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import MainLayout from "~/components/layout/Main";

const NotFound = () => {
	return (
		<>
			<Title>Not Found - ServiGraf</Title>
			<MainLayout>
				<h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
					Not Found
				</h1>
				<p class="mt-8">
					Visit{" "}
					<a
						href="https://solidjs.com"
						target="_blank"
						class="text-sky-600 hover:underline"
						rel="noopener"
					>
						solidjs.com
					</a>{" "}
					to learn how to build Solid apps.
				</p>
				<p class="my-4">
					<A href="/" class="text-sky-600 hover:underline">
						Home
					</A>
					{" - "}
					<A href="/about" class="text-sky-600 hover:underline">
						About Page
					</A>
				</p>
			</MainLayout>
		</>
	);
};

export default NotFound;
