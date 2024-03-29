import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "../Login/Login.module.css";

export default function Signup() {
	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		passwordConfirmation: "",
	});
	const [errorMessage, setErrorMessage] = useState(false);
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
		if (formData.password !== formData.passwordConfirmation) {
			setErrorMessage("Contraseñas no coinciden");
		}
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: formData.email,
				firstName: formData.firstName,
				lastName: formData.lastName,
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
				setErrorMessage("Ya existe una cuenta con ese correo");
			});
	}

	return (
		<div className={classes.auth}>
			<h1>Crear Cuenta</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Correo</label>
				<input
					className={classes.authInput}
					type="email"
					onChange={handleChange}
					name="email"
					id="email"
					required
				/>
				<label htmlFor="firstName">Nombre</label>
				<input
					className={classes.authInput}
					type="text"
					onChange={handleChange}
					name="firstName"
					id="firstName"
					required
				/>
				<label htmlFor="lastName">Apellidos</label>
				<input
					className={classes.authInput}
					type="text"
					onChange={handleChange}
					name="lastName"
					id="lastName"
					required
				/>
				<label htmlFor="password">Contraseña</label>
				<input
					className={classes.authInput}
					type="password"
					onChange={handleChange}
					name="password"
					id="password"
					required
				/>
				<label htmlFor="passwordConfirmation">Confirma Contraseña</label>
				<input
					className={classes.authInput}
					type="password"
					onChange={handleChange}
					name="passwordConfirmation"
					id="passwordConfirmation"
					required
				/>
				<button>Crear</button>
				{errorMessage && <div className={classes.error}>{errorMessage}</div>}
			</form>
		</div>
	);
}
