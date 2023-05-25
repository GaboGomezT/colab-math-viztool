import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Boards from "./components/Boards/Boards";
import Teams from "./components/Teams/Teams";
import "./index.css";
import Whiteboard from "./components/Whiteboard/Whiteboard";
import Invitation from "./components/Invitacion/Invitation";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/crear-cuenta",
		element: <Signup />,
	},
	{
		path: "/tableros",
		element: (
			<Dashboard>
				<Boards />
			</Dashboard>
		),
	},
	{
		path: "/equipos",
		element: (
			<Dashboard>
				<Teams />
			</Dashboard>
		),
	},
	{
		path: "/tableros/:boardId",
		element: <Whiteboard />,
	},
	{
		path: "/equipos/:teamId",
		element: (
			<Dashboard>
				<Boards />
			</Dashboard>
		),
	},
	{
		path: "/equipos/:teamId/invitacion",
		element: <Invitation />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
