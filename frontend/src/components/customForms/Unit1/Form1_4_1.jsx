import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form1_4_1({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [px, setPx] = useState(0);
    const [py, setPy] = useState(0);
    const [pz, setPz] = useState(0);

    const [vx, setVx] = useState(0);
    const [vy, setVy] = useState(0);
    const [vz, setVz] = useState(0);

    return (
        <div className="graph-form">
            {graphName}
            <form>
                <label className="number-input">
                    Punto - X:
                    <input
                        type="number"
                        onChange={(e) => setPx(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Punto - Y:
                    <input
                        type="number"
                        onChange={(e) => setPy(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Punto - Z:
                    <input
                        type="number"
                        onChange={(e) => setPz(e.target.value)}
                    />
                </label>

                <label className="number-input">
                    Vector - X:
                    <input
                        type="number"
                        onChange={(e) => setVx(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector - Y:
                    <input
                        type="number"
                        onChange={(e) => setVy(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector - Z:
                    <input
                        type="number"
                        onChange={(e) => setVz(e.target.value)}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            point: [parseInt(px), parseInt(py), parseInt(pz)],
                            vector: [parseInt(vx), parseInt(vy), parseInt(vz)],
                        };
                        handleGraphCreation(graphName, args);
                    }}
                >
                    {newComponent ? "Create" : "Update"}
                </button>
            </form>
        </div>
    );
}
