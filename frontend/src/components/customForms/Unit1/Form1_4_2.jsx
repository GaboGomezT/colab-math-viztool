import React, { useState } from "react";
import "../Forms.modules.css";

export default function FormPoints({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [ax, setAx] = useState(0);
    const [ay, setAy] = useState(0);
    const [az, setAz] = useState(0);

    const [bx, setBx] = useState(0);
    const [by, setBy] = useState(0);
    const [bz, setBz] = useState(0);

    return (
        <div className="graph-form">
            <form>
                <label className="number-input">
                    Point A - X:
                    <input
                        type="number"
                        onChange={(e) => setAx(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point A - Y:
                    <input
                        type="number"
                        onChange={(e) => setAy(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point A - Z:
                    <input
                        type="number"
                        onChange={(e) => setAz(parseInt(e.target.value))}
                    />
                </label>

                <label className="number-input">
                    Point B - X:
                    <input
                        type="number"
                        onChange={(e) => setBx(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point B - Y:
                    <input
                        type="number"
                        onChange={(e) => setBy(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point B - Z:
                    <input
                        type="number"
                        onChange={(e) => setBz(parseInt(e.target.value))}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            pointA: [ax, ay, az],
                            pointB: [bx, by, bz],
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
