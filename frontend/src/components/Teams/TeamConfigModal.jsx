import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TeamConfigModal({
	teamId,
	teamName,
	setUsersTeams,
	closeModal,
}) {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
	const [name, setName] = useState(teamName);
	const url = `${window.location.origin}${location.pathname}/${teamId}/invitacion`;

	const handleCheckboxChange = (e) => {
		const { checked } = e.target;
		setIsOpen(checked);
		// make a partial request to the backend sending updating isOpen with checked value
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/teams/${teamId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": accessToken,
			},
			body: JSON.stringify({ isOpen: checked, name: name }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	};

	useEffect(() => {
		// get access_token from localStorage
		const authToken = localStorage.getItem("access_token");
		setAccessToken(authToken);
		// get team detail
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/teams/${teamId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": authToken,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setIsOpen(data.isOpen);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	}, []);

	const handleInputChange = (e) => {
		const { value } = e.target;
		setName(value);
	};

	const nameSubmit = (e) => {
		e.preventDefault();
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/teams/${teamId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": accessToken,
			},
			body: JSON.stringify({ name, isOpen }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then(() => {
				setUsersTeams((prevState) => {
					const newState = prevState.map((team) => {
						if (team.id === teamId) {
							return { ...team, name };
						}
						return team;
					});
					return newState;
				});
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	};

	const handleDelete = (e) => {
		e.preventDefault();
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/teams/${teamId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": accessToken,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then(() => {
				setUsersTeams((prevState) => {
					const newState = prevState.filter((team) => team.id !== teamId);
					return newState;
				});
				closeModal();
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	};

	return (
		<div className="modal-container">
			<div className="modal-form large-form">
				<div>
					Enlace de invitación:
					<p>{url}</p>
				</div>
				<div>
					<label htmlFor="isOpen">Estado de invitación:</label>
					<input
						id="isOpen"
						name="isOpen"
						type="checkbox"
						checked={isOpen}
						onChange={handleCheckboxChange}
					/>
				</div>
				<div>
					<label htmlFor="name">Nombre: </label>
					<input
						id="name"
						name="name"
						type="text"
						value={name}
						onChange={handleInputChange}
					/>
					<button onClick={nameSubmit}>Cambiar</button>
				</div>
				<div className="modal-buttons">
					<button type="button" onClick={closeModal}>
						Cerrar
					</button>
					<button className="delete-btn" onClick={handleDelete}>
						Eliminar
					</button>
				</div>
			</div>
		</div>
	);
}
