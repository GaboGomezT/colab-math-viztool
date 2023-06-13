import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form1_2({
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

    const [x3, setX3] = useState(0);
    const [y3, setY3] = useState(0);
    const [z3, setZ3] = useState(0);

    return (
        <div className="graph-form">
            <form>
                <label className="number-input">
                    Vector 1 - X:
                    <input
                        type="number"
                        onChange={(e) => setX1(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector 1 - Y:
                    <input
                        type="number"
                        onChange={(e) => setY1(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector 1 - Z:
                    <input
                        type="number"
                        onChange={(e) => setZ1(e.target.value)}
                    />
                </label>

                <label className="number-input">
                    Vector 2 - X:
                    <input
                        type="number"
                        onChange={(e) => setX2(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector 2 - Y:
                    <input
                        type="number"
                        onChange={(e) => setY2(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector 2 - Z:
                    <input
                        type="number"
                        onChange={(e) => setZ2(e.target.value)}
                    />
                </label>

                <label className="number-input">
                    Vector 3 - X:
                    <input
                        type="number"
                        onChange={(e) => setX3(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector 3 - Y:
                    <input
                        type="number"
                        onChange={(e) => setY3(e.target.value)}
                    />
                </label>
                <label className="number-input">
                    Vector 3 - Z:
                    <input
                        type="number"
                        onChange={(e) => setZ3(e.target.value)}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            vectors: [
                                [parseInt(x1), parseInt(y1), parseInt(z1)],
                                [parseInt(x2), parseInt(y2), parseInt(z2)],
                                [parseInt(x3), parseInt(y3), parseInt(z3)],
                            ],
                        };
                        console.log(args);
                        handleGraphCreation(graphName, args);
                    }}
                >
                    {newComponent ? "Create" : "Update"}
                </button>
            </form>
        </div>
    );
}
