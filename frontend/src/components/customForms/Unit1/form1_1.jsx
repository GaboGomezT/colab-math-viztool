import React from "react";
import "../Forms.modules.css";

export default function Form1_1({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    return (
        <div className="graph-form">
            <form>
                <label className="number-input">
                    rx:
                    <input type="number" name="rx" />
                </label>
                <label className="number-input">
                    ry:
                    <input type="number" name="ry" />
                </label>
                <label className="number-input">
                    rz:
                    <input type="number" name="rz" />
                </label>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const rx = e.target.rx.value;
                        const ry = e.target.ry.value;
                        const rz = e.target.rz.value;
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
