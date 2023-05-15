import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TeamInfo from "./TeamInfo.jsx";
import CreateTeamModal from "./CreateTeamModal.jsx";
import "./Teams.modules.css";

export default function Teams() {
	const [selectedValue, setSelectedValue] = useState("last-created");
	const [accessToken, setAccessToken] = useState(null);
	const [usersTeams, setUsersTeams] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [teamData, setTeamData] = useState({
		name: "",
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
					orderTeams(data.teams);
				})
				.catch((error) => {
					console.error("There was a problem with the fetch operation:", error);
				});
		}
	}, [accessToken]);

	useEffect(() => {
		setTeamData({
			name: "",
		});
	}, [showModal]);

	useEffect(() => {
		orderTeams(usersTeams.slice());
	}, [selectedValue]);

	function orderTeams(teams) {
		// Right now last-modified and last-created will give the same result because currently there is no way to modify a board
		// Test this functionality when the board is implemented
		let orderFunction;
		if (selectedValue === "last-created") {
			orderFunction = (a, b) => new Date(b.created) - new Date(a.created);
		}
		if (selectedValue === "first-created") {
			orderFunction = (a, b) => new Date(a.created) - new Date(b.created);
		}
		const orderedTeams = teams.sort(orderFunction);
		setUsersTeams(orderedTeams);
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTeamData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_API_URL}/teams`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": accessToken,
					},
					body: JSON.stringify(teamData),
				}
			);
			const data = await response.json();
			orderTeams([...usersTeams, data]);
			setShowModal(false);
		} catch (error) {
			console.error("Error creating board:", error);
		}
	};

	const teamComponents = usersTeams.map((team) => {
		const created = new Date(team.created);
		const formattedCreated = created.toLocaleDateString("es-MX");
		return (
			<TeamInfo key={team.id} name={team.name} createdDate={formattedCreated} />
		);
	});
	return (
		<div className="board-view">
			<span className="view-title">Tus Equipos</span>
			<div className="options">
				<button className="new-board-btn" onClick={() => setShowModal(true)}>
					<FontAwesomeIcon icon={faPlus} className="board-btn-icon" />
					<p className="board-btn-text">Nuevo Equipo</p>
				</button>
				<div className="drop-down">
					<label htmlFor="orderInput">Ordenar por: </label>
					<select
						id="orderInput"
						value={selectedValue}
						onChange={(e) => setSelectedValue(e.target.value)}
					>
						<option value="last-created">Último creado</option>
						<option value="first-created">Primero creado</option>
					</select>
				</div>
			</div>
			{showModal && (
				<CreateTeamModal
					teamData={teamData}
					handleChange={handleChange}
					handleSubmit={handleSubmit}
					closeModal={() => setShowModal(false)}
				/>
			)}
			<div className="teams">{teamComponents}</div>
		</div>
	);
}
