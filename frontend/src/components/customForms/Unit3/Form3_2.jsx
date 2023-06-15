import React, { useState } from "react";
import "../Forms.modules.css";

export default function Form3_2({
    handleGraphCreation,
    graphName,
    newComponent,
}) {
    const [f_string, setFString] = useState("");
    const [a_string, setAString] = useState("");
    const [b_string, setBString] = useState("");
    const [c, setC] = useState(0);
    const [d, setD] = useState(0);

    return (
        <div className="graph-form">
            {graphName}
            <form>
                <label className="string-input">
                    función f:
                    <input
                        type="text"
                        onChange={(e) => setFString(e.target.value)}
                    />
                </label>

                <label className="string-input">
                    función a:
                    <input
                        type="text"
                        onChange={(e) => setAString(e.target.value)}
                    />
                </label>

                <label className="string-input">
                    función b:
                    <input
                        type="text"
                        onChange={(e) => setBString(e.target.value)}
                    />
                </label>

                <label className="number-input">
                    c:
                    <input
                        type="number"
                        onChange={(e) => setC(parseInt(e.target.value))}
                    />
                </label>

                <label className="number-input">
                    d:
                    <input
                        type="number"
                        onChange={(e) => setD(parseInt(e.target.value))}
                    />
                </label>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const args = {
                            f_string,
                            a_string,
                            b_string,
                            c,
                            d,
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
