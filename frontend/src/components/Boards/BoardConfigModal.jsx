import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function BoardConfigModal({
	boardId,
	boardName,
	setUsersBoards,
	closeModal,
}) {
	const [accessToken, setAccessToken] = useState(null);
	const [name, setName] = useState(boardName);

	useEffect(() => {
		// get access_token from localStorage
		const authToken = localStorage.getItem("access_token");
		setAccessToken(authToken);
	}, []);

	const handleInputChange = (e) => {
		const { value } = e.target;
		setName(value);
	};

	const nameSubmit = (e) => {
		e.preventDefault();
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/boards/${boardId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": accessToken,
			},
			body: JSON.stringify({ name }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then(() => {
				setUsersBoards((prevState) => {
					const newState = prevState.map((board) => {
						if (board.id === boardId) {
							return { ...board, name };
						}
						return board;
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
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/boards/${boardId}`, {
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
				setUsersBoards((prevState) => {
					const newState = prevState.filter((board) => board.id !== boardId);
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
