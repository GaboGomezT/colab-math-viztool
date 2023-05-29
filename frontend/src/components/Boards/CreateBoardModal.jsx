import React from "react";

export default function CreateBoardModal({
	boardData,
	handleChange,
	handleSubmit,
	closeModal,
	teamOptions,
}) {
	const { name, teamId } = boardData;
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
					<label htmlFor="teamId">Equipo: </label>
					<select
						id="teamId"
						value={teamId}
						onChange={(e) => {
							handleChange({
								target: {
									name: "teamId",
									value: e.target.value,
								},
							});
						}}
						className="team-select"
					>
						{teamOptions.map((team) => (
							<option key={team.id} value={team.id}>
								{team.name}
							</option>
						))}
					</select>
				</div>
				<button type="submit">Crear</button>
				<button type="button" onClick={closeModal}>
					Cancelar
				</button>
			</form>
		</div>
	);
}
