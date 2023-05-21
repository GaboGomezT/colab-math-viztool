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
		console.log(firstName);
		const lastName = localStorage.getItem("last_name");
		setName(`${firstName} ${lastName}`);
	}, []);

	const deleteToken = () => {
		localStorage.removeItem("access_token");
		navigate("/");
	};
	return (
		<main>
			<header>
				<h2>¡Hola, {name}!</h2>
				<span onClick={deleteToken}>Cerrar Sesión</span>
			</header>
			{props.children}
			<div className={classes.navbar}>
				<div>
					<NavLink to="/tableros">
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
		</main>
	);
}
