import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form1_6_3({
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

    const [cx, setCx] = useState(0);
    const [cy, setCy] = useState(0);
    const [cz, setCz] = useState(0);

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

                <label className="number-input">
                    Point C - X:
                    <input
                        type="number"
                        onChange={(e) => setCx(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point C - Y:
                    <input
                        type="number"
                        onChange={(e) => setCy(parseInt(e.target.value))}
                    />
                </label>
                <label className="number-input">
                    Point C - Z:
                    <input
                        type="number"
                        onChange={(e) => setCz(parseInt(e.target.value))}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            pointA: [ax, ay, az],
                            pointB: [bx, by, bz],
                            pointC: [cx, cy, cz],
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
