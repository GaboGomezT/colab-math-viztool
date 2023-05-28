import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function BoardInfo({
	id,
	group,
	name,
	handleConfigClick,
	isOwner,
	createdDate,
	modifiedDate,
}) {
	return (
		<div className="board">
			<Link to={`/tableros/${id}`}>
				<div className="board-info">
					<span className="info-group">{group}</span>
					<span className="info-name">{name}</span>
					<span className="info-dates">
						Fecha Creación: {createdDate} Fecha Modificación: {modifiedDate}
					</span>
				</div>
			</Link>
			{isOwner && (
				<FontAwesomeIcon
					icon={faEllipsisVertical}
					onClick={() => handleConfigClick(id)}
					className="info-icon"
				/>
			)}
		</div>
	);
}
