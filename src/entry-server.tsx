// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/iso_blue.svg" />
					{assets}
				</head>
				<body>
					<div id="app">{children}</div>
					<div id="alerts"></div>
					<div id="modals"></div>
					<div id="loader"></div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
