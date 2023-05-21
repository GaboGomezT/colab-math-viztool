import React from "react";

export default function CreateTeamModal({
	teamData,
	handleChange,
	handleSubmit,
	closeModal,
}) {
	const { name } = teamData;
	return (
		<div className="modal-container">
			<form onSubmit={handleSubmit} className="modal-form">
				<h2>Crear Equipos</h2>
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
				<button type="submit">Crear</button>
				<button type="button" onClick={closeModal}>
					Cancelar
				</button>
			</form>
		</div>
	);
}
