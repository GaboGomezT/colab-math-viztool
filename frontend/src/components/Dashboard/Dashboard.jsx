import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard, faUsers } from "@fortawesome/free-solid-svg-icons";
import classes from "./Dashboard.module.css";

export default function Dashboard(props) {
	return (
		<main>
			<header>
				<h2>¡Hola, Gabriel!</h2>
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
