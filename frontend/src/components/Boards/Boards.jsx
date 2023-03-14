import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import BoardInfo from "./BoardInfo.jsx";
import "./Boards.modules.css";

export default function Boards() {
	const [selectedValue, setSelectedValue] = useState("last-modified");
	return (
		<div className="board-view">
			<span className="view-title">Tus Tableros</span>
			<div className="options">
				<button className="new-board-btn">
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
