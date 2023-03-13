import React from "react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard, faUsers } from "@fortawesome/free-solid-svg-icons";
import classes from "./Dashboard.module.css";

export default function Dashboard() {
	return (
		<main>
			<header>
				<h2>¡Hola, Gabriel!</h2>
			</header>
			<Outlet />
			<div className={classes.navbar}>
				<div>
					<NavLink>
						<FontAwesomeIcon
							icon={faChalkboard}
							className={classes.icon}
						></FontAwesomeIcon>
						Tableros
					</NavLink>
				</div>
				<div>
					<NavLink>
						<FontAwesomeIcon
							icon={faUsers}
							className={classes.icon}
						></FontAwesomeIcon>
						Equipos
					</NavLink>
				</div>
			</div>
		</main>
	);
}
