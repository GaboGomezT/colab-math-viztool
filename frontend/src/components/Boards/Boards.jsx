import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import BoardInfo from "./BoardInfo.jsx";
import CreateBoardModal from "./CreateBoardModal.jsx";
import "./Boards.modules.css";

export default function Boards() {
	const [selectedValue, setSelectedValue] = useState("last-modified");
	const [accessToken, setAccessToken] = useState(null);
	const [usersBoards, setUsersBoards] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [boardData, setBoardData] = useState({
		name: "",
		teamId: "",
		isPublic: false,
	});

	useEffect(() => {
		const authToken = localStorage.getItem("access_token");
		if (!authToken) {
			navigate("/");
		}
		setAccessToken(authToken);
	}, []);

	useEffect(() => {
		if (accessToken) {
			fetch(`${import.meta.env.VITE_BACKEND_API_URL}/boards`, {
				method: "GET",
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
				.then((data) => {
					setUsersBoards(data.allBoards);
				})
				.catch((error) => {
					console.error("There was a problem with the fetch operation:", error);
				});
		}
	}, [accessToken]);

	useEffect(() => {
		setBoardData({
			name: "",
			teamId: "",
			isPublic: false,
		});
	}, [showModal]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBoardData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleCheckboxChange = (e) => {
		const { name, checked } = e.target;
		setBoardData((prevState) => ({ ...prevState, [name]: checked }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_API_URL}/boards`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": accessToken,
					},
					body: JSON.stringify(boardData),
				}
			);
			const data = await response.json();
			console.log("Board created:", data);
			setShowModal(false);
		} catch (error) {
			console.error("Error creating board:", error);
		}
	};
	return (
		<div className="board-view">
			<span className="view-title">Tus Tableros</span>
			<div className="options">
				<button className="new-board-btn" onClick={() => setShowModal(true)}>
					<FontAwesomeIcon icon={faPlus} className="board-btn-icon" />
					<p className="board-btn-text">Nuevo Tablero</p>
				</button>
				<div className="drop-down">
					<label htmlFor="orderInput">Ordenar por: </label>
					<select
						id="orderInput"
						value={selectedValue}
						onChange={(e) => setSelectedValue(e.target.value)}
					>
						<option value="last-modified">Último modificado</option>
						<option value="last-created">Último creado</option>
						<option value="first-created">Primero creado</option>
					</select>
				</div>
			</div>
			{showModal && (
				<CreateBoardModal
					boardData={boardData}
					handleChange={handleChange}
					handleCheckboxChange={handleCheckboxChange}
					handleSubmit={handleSubmit}
					closeModal={() => setShowModal(false)}
				/>
			)}
			<div className="boards">
				<BoardInfo
					group={"1CM2"}
					name={"Producto punto entre dos vectores"}
					createdDate={"05/03/2023"}
					modifiedDate={"06/03/2023"}
				/>
			</div>
		</div>
	);
}
