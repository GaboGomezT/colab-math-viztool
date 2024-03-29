import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";

export default function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem("access_token")) {
			navigate("/tableros");
		}
	}, []);

	function handleChange(event) {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[event.target.name]: event.target.value,
			};
		});
	}

	function handleSubmit(event) {
		event.preventDefault();
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: formData.email,
				password: formData.password,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				localStorage.setItem("first_name", data.firstName);
				localStorage.setItem("last_name", data.lastName);
				localStorage.setItem("access_token", data.accessToken);
				navigate("/tableros");
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
				setError(true);
			});
	}

	return (
		<div className={classes.auth}>
			<h1>Iniciar Sesión</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Correo</label>
				<input
					className={classes.authInput}
					type="email"
					onChange={handleChange}
					name="email"
					id="email"
				/>
				<label htmlFor="password">Contraseña</label>
				<input
					className={classes.authInput}
					type="password"
					onChange={handleChange}
					name="password"
					id="password"
				/>
				<button>Entrar</button>
				{error && (
					<div className={classes.error}>Contraseña o Correo Incorrecto</div>
				)}
			</form>
			<p>
				<Link to="/crear-cuenta">Crear Cuenta</Link>
			</p>
		</div>
	);
}
