import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form1_4_3({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [xo, setXo] = useState(0);
    const [yo, setYo] = useState(0);
    const [zo, setZo] = useState(0);

    const [A, setA] = useState(0);
    const [B, setB] = useState(0);
    const [C, setC] = useState(0);
    const [D, setD] = useState(0);

    return (
        <div className="graph-form">
            {graphName}
            <form>
                <label className="number-input">
                    Point - xo:
                    <input
                        type="number"
                        onChange={(e) => setXo(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point - yo:
                    <input
                        type="number"
                        onChange={(e) => setYo(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point - zo:
                    <input
                        type="number"
                        onChange={(e) => setZo(parseInt(e.target.value))}
                    />
                </label>

                <label className="number-input">
                    PlaneEq - A:
                    <input
                        type="number"
                        onChange={(e) => setA(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    PlaneEq - B:
                    <input
                        type="number"
                        onChange={(e) => setB(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    PlaneEq - C:
                    <input
                        type="number"
                        onChange={(e) => setC(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    PlaneEq - D:
                    <input
                        type="number"
                        onChange={(e) => setD(parseInt(e.target.value))}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            point: { xo, yo, zo },
                            planeEq: { A, B, C, D },
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
