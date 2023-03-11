import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/iniciar-sesion",
		element: <Login />,
	},
	{
		path: "/crear-cuenta",
		element: <Signup />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
