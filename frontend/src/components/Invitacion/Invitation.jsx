import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Invitation.modules.css";

export default function Invitation() {
	const { teamId } = useParams();
	const [teamData, setTeamData] = useState({});
	const [accessToken, setAccessToken] = useState(null);
	const navigate = useNavigate();
	const addRequestMadeRef = useRef(false);
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const authToken = localStorage.getItem("access_token");
		if (!authToken) {
			navigate("/");
		}
		setAccessToken(authToken);

		// Get team detail from backend
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
				setTeamData(data);
				if (!data.isOpen) {
					setShowMessage(true);
				}
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	}, []);

	useEffect(() => {
		// if Team is open, add user to team
		if (teamData && teamData.isOpen && !addRequestMadeRef.current) {
			addRequestMadeRef.current = true;
			fetch(
				`${import.meta.env.VITE_BACKEND_API_URL}/teams/${teamId}/add-user`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": accessToken,
					},
				}
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					console.log(data);
					navigate(`/equipos/${teamId}`);
				})
				.catch((error) => {
					console.error("There was a problem with the fetch operation:", error);
					navigate("/");
				});
		}
	}, [teamData]);

	return (
		<div>
			<h1>Invitación para {teamData.name}</h1>
			{showMessage && (
				<div className="invitation-div">
					<h2 className="closed-invitation-message">
						La invitación al equipo está desactivada
					</h2>
					<Link to="/">Volver a inicio</Link>
				</div>
			)}
		</div>
	);
}
