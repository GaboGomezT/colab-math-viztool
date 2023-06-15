import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form1({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [rx, setRx] = useState(0);
    const [ry, setRy] = useState(0);
    const [rz, setRz] = useState(0);
    return (
        <div className="graph-form">
            {graphName}
            <form>
                <label className="number-input">
                    rx:
                    <input
                        type="number"
                        name="rx"
                        onChange={(e) => setRx(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    ry:
                    <input
                        type="number"
                        name="ry"
                        onChange={(e) => setRy(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    rz:
                    <input
                        type="number"
                        name="rz"
                        onChange={(e) => setRz(e.target.value)}
                    />
                </label>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = { rx, ry, rz };
                        handleGraphCreation(graphName, args);
                    }}
                >
                    {newComponent ? "Crear" : "Actualizar"}
                </button>
            </form>
        </div>
    );
}
