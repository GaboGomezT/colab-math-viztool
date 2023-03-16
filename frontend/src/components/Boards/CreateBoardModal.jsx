import React from "react";

export default function CreateBoardModal({
	boardData,
	handleChange,
	handleCheckboxChange,
	handleSubmit,
	closeModal,
}) {
	const { name, teamId, isPublic } = boardData;
	return (
		<div className="modal-container">
			<form onSubmit={handleSubmit} className="modal-form">
				<h2>Crear Tablero</h2>
				<div>
					<label htmlFor="name">Nombre:</label>
					<input
						id="name"
						name="name"
						type="text"
						value={name}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="teamId">Equipo:</label>
					<input
						id="teamId"
						name="teamId"
						type="text"
						value={teamId}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="isPublic">Público:</label>
					<input
						id="isPublic"
						name="isPublic"
						type="checkbox"
						checked={isPublic}
						onChange={handleCheckboxChange}
					/>
				</div>
				<button type="submit">Create</button>
				<button type="button" onClick={closeModal}>
					Cancel
				</button>
			</form>
		</div>
	);
}
