import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function BoardInfo({ group, name, createdDate, modifiedDate }) {
	return (
		<div className="board">
			<div className="board-info">
				<span className="info-group">{group}</span>
				<span className="info-name">{name}</span>
				<span className="info-dates">
					Fecha Creación: {createdDate} Fecha Modificación: {modifiedDate}
				</span>
			</div>
			<FontAwesomeIcon icon={faEllipsisVertical} className="info-icon" />
		</div>
	);
}
