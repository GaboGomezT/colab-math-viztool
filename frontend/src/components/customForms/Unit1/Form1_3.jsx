import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form1_3({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [x1, setX1] = useState(0);
    const [y1, setY1] = useState(0);
    const [z1, setZ1] = useState(0);

    const [x2, setX2] = useState(0);
    const [y2, setY2] = useState(0);
    const [z2, setZ2] = useState(0);

    return (
        <div className="graph-form">
            <form>
                <label className="number-input">
                    Vector A - X:
                    <input
                        type="number"
                        onChange={(e) => setX1(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector A - Y:
                    <input
                        type="number"
                        onChange={(e) => setY1(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector A - Z:
                    <input
                        type="number"
                        onChange={(e) => setZ1(e.target.value)}
                    />
                </label>

                <label className="number-input">
                    Vector B - X:
                    <input
                        type="number"
                        onChange={(e) => setX2(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector B - Y:
                    <input
                        type="number"
                        onChange={(e) => setY2(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector B - Z:
                    <input
                        type="number"
                        onChange={(e) => setZ2(e.target.value)}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            vectorA: [parseInt(x1), parseInt(y1), parseInt(z1)],
                            vectorB: [parseInt(x2), parseInt(y2), parseInt(z2)],
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
