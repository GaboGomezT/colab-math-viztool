import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function TeamInfo({
	id,
	name,
	createdDate,
	handleInviteClick,
	isOwner,
}) {
	return (
		<div className="board">
			<Link to={`/equipos/${id}`}>
				<div className="board-info">
					<span className="info-name">{name}</span>
					<span className="info-dates">Fecha Creación: {createdDate}</span>
				</div>
			</Link>
			{isOwner && (
				<FontAwesomeIcon
					icon={faEllipsisVertical}
					className="info-icon"
					onClick={() => handleInviteClick(id)}
				/>
			)}
		</div>
	);
}
