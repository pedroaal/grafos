const Footer = () => {
	return (
		<nav class="bg-sky-800">
			<ul class="container flex items-center p-3 text-gray-200">
				<li class={`border-b-2 mx-1.5 sm:mx-6`}>
					<a href="/">Home</a>
				</li>
				<li class={`border-b-2 mx-1.5 sm:mx-6`}>
					<a href="/about">About</a>
				</li>
			</ul>
		</nav>
	);
};

export default Footer;
