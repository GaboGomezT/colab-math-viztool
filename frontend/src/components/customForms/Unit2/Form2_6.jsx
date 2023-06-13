import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form2_6({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [f1, setF1] = useState("");
    const [f2, setF2] = useState("");
    const [f3, setF3] = useState("");

    return (
        <div className="graph-form">
            <form>
                <label className="string-input">
                    f1:
                    <input
                        type="text"
                        onChange={(e) => setF1(e.target.value)}
                    />
                </label>

                <label className="string-input">
                    f2:
                    <input
                        type="text"
                        onChange={(e) => setF2(e.target.value)}
                    />
                </label>

                <label className="string-input">
                    f3:
                    <input
                        type="text"
                        onChange={(e) => setF3(e.target.value)}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = { f1, f2, f3 };
                        handleGraphCreation(graphName, args);
                    }}
                >
                    {newComponent ? "Create" : "Update"}
                </button>
            </form>
        </div>
    );
}
