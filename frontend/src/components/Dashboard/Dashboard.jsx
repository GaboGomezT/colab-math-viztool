import React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import classes from "./Dashboard.module.css";

export default function Dashboard(props) {
	const navigate = useNavigate();
	const [name, setName] = useState("");

	useEffect(() => {
		const firstName = localStorage.getItem("first_name");
		const lastName = localStorage.getItem("last_name");
		setName(`${firstName} ${lastName}`);
	}, []);

	const deleteToken = () => {
		localStorage.removeItem("access_token");
		navigate("/");
	};
	return (
		<main>
			<div className={classes.navbar}>
				<div>
					{/* This links to root because that assured a re-render of the boards page */}
					{/* This is a hack for the issue when getting boards of a team */}
					<NavLink to="/">
						<FontAwesomeIcon icon={faChalkboard} className={classes.icon} />
						Tableros
					</NavLink>
				</div>
				<div>
					<NavLink to="/equipos">
						<FontAwesomeIcon icon={faUsers} className={classes.icon} />
						Equipos
					</NavLink>
				</div>
			</div>
			<div className={classes.rightDashboard}>
				<header>
					<h2>¡Hola, {name}!</h2>
					<span onClick={deleteToken}>Cerrar Sesión</span>
				</header>
				{props.children}
			</div>
		</main>
	);
}
