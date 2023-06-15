import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { compile } from "mathjs";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function VectorField2_6({
    args,
    id,
    handleDeleteGraph,
    canEdit,
}) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];
        const { f1, f2, f3 } = args;
        // Create the vector field functions using math.js
        const F1 = compile(f1);
        const F2 = compile(f2);
        const F3 = compile(f3);

        // Set the domain and resolution of the vector field
        const minX = -5;
        const maxX = 5;
        const minY = -5;
        const maxY = 5;
        const minZ = -5;
        const maxZ = 5;
        const resolution = 2;

        try {
            // Create the grid of vectors
            for (let x = minX; x <= maxX; x += resolution) {
                for (let y = minY; y <= maxY; y += resolution) {
                    for (let z = minZ; z <= maxZ; z += resolution) {
                        const vector = new THREE.Vector3(
                            F1.evaluate({ x: x, y: y, z: z }),
                            F2.evaluate({ x: x, y: y, z: z }),
                            F3.evaluate({ x: x, y: y, z: z })
                        );
                        vector.normalize();

                        const arrow = new THREE.ArrowHelper(
                            vector,
                            new THREE.Vector3(x, y, z),
                            resolution,
                            0x000000
                        );
                        components.push(arrow);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setDescription("Error en alguna función");
        }

        setSceneComponents(components);
    }, []);
    return (
        <CoordinateSystem
            sceneComponents={sceneComponents}
            description={description}
            id={id}
            handleDeleteGraph={handleDeleteGraph}
            canEdit={canEdit}
        />
    );
}
