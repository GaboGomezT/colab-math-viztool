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
	const [teamOptions, setTeamOptions] = useState([]);

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
					orderBoards(data.allBoards);
				})
				.catch((error) => {
					console.error(
						"There was a problem with the fetch operation (getting boards):",
						error
					);
				});

			fetch(`${import.meta.env.VITE_BACKEND_API_URL}/teams`, {
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
					setTeamOptions(data.teams);
				})
				.catch((error) => {
					console.error(
						"There was a problem with the fetch operation (getting teams):",
						error
					);
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

	useEffect(() => {
		orderBoards(usersBoards.slice());
	}, [selectedValue]);

	function orderBoards(boards) {
		// Right now last-modified and last-created will give the same result because currently there is no way to modify a board
		// Test this functionality when the board is implemented
		let orderFunction;
		if (selectedValue === "last-modified") {
			orderFunction = (a, b) => new Date(b.modified) - new Date(a.modified);
		}
		if (selectedValue === "last-created") {
			orderFunction = (a, b) => new Date(b.created) - new Date(a.created);
		}
		if (selectedValue === "first-created") {
			orderFunction = (a, b) => new Date(a.created) - new Date(b.created);
		}
		const orderedBoards = boards.sort(orderFunction);
		setUsersBoards(orderedBoards);
	}

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
			orderBoards([...usersBoards, data]);
			setShowModal(false);
		} catch (error) {
			console.error("Error creating board:", error);
		}
	};

	const boardComponents = usersBoards.map((board) => {
		const created = new Date(board.created);
		const formattedCreated = created.toLocaleDateString("es-MX");
		const modified = new Date(board.modified);
		const formattedModified = modified.toLocaleDateString("es-MX");
		// Missing team prop
		// TODO: Add team prop when implementing team feature
		return (
			<BoardInfo
				key={board.id}
				name={board.name}
				createdDate={formattedCreated}
				modifiedDate={formattedModified}
			/>
		);
	});
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
					teamOptions={teamOptions}
				/>
			)}
			<div className="boards">{boardComponents}</div>
		</div>
	);
}
