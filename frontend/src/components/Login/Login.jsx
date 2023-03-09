import React from "react";
import { useState } from "react";
import "./Login.module.css";

export default function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

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
			body: JSON.stringify(formData),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	}

	return (
		<main>
			<h1>Iniciar Sesión</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Correo</label>
				<input type="email" onChange={handleChange} name="email" id="email" />
				<label htmlFor="password">Contraseña</label>
				<input
					type="password"
					onChange={handleChange}
					name="password"
					id="password"
				/>
				<button>Entrar</button>
			</form>
			<p>Crear cuenta</p>
		</main>
	);
}
