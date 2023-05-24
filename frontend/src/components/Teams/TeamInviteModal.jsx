import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TeamInviteModal({ teamId, closeModal }) {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
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
			body: JSON.stringify({ isOpen: checked }),
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

	return (
		<div className="modal-container">
			<div className="modal-form large-form">
				<h2>Invitación</h2>
				<span>{url}</span>
				<div>
					<label htmlFor="isOpen">activa:</label>
					<input
						id="isOpen"
						name="isOpen"
						type="checkbox"
						checked={isOpen}
						onChange={handleCheckboxChange}
					/>
				</div>
				<button type="button" onClick={closeModal}>
					Cerrar
				</button>
			</div>
		</div>
	);
}
