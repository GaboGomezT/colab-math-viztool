import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { compile, derivative } from "mathjs";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function VectorDivergence2_7({ args }) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    function getColor(value, min, max) {
        // Normalize the value between 0 and 1
        const normalizedValue = (value - min) / (max - min);

        // Define start (red) and end (blue) colors
        const startColor = new THREE.Color(0xff0000); // red
        const endColor = new THREE.Color(0x0000ff); // blue

        // Interpolate color
        const color = new THREE.Color();
        color.r = startColor.r + normalizedValue * (endColor.r - startColor.r);
        color.g = startColor.g + normalizedValue * (endColor.g - startColor.g);
        color.b = startColor.b + normalizedValue * (endColor.b - startColor.b);

        return color;
    }

    useEffect(() => {
        let components = [];
        const { f1, f2, f3 } = args;

        // Compute the partial derivatives
        const F1_dx = compile(derivative(f1, "x").toString());
        const F2_dy = compile(derivative(f2, "y").toString());
        const F3_dz = compile(derivative(f3, "z").toString());
        console.log(derivative(f1, "x").toString());
        // Set the domain and resolution of the vector field
        const minX = -5;
        const maxX = 5;
        const minY = -5;
        const maxY = 5;
        const minZ = -5;
        const maxZ = 5;
        const resolution = 1;

        let minDivergence = Infinity;
        let maxDivergence = -Infinity;

        // Compute min and max divergence
        for (let x = minX; x <= maxX; x += resolution) {
            for (let y = minY; y <= maxY; y += resolution) {
                for (let z = minZ; z <= maxZ; z += resolution) {
                    const divergence =
                        F1_dx.evaluate({ x: x, y: y, z: z }) +
                        F2_dy.evaluate({ x: x, y: y, z: z }) +
                        F3_dz.evaluate({ x: x, y: y, z: z });

                    minDivergence = Math.min(minDivergence, divergence);
                    maxDivergence = Math.max(maxDivergence, divergence);
                }
            }
        }

        for (let x = minX; x <= maxX; x += resolution) {
            for (let y = minY; y <= maxY; y += resolution) {
                for (let z = minZ; z <= maxZ; z += resolution) {
                    const divergence =
                        F1_dx.evaluate({ x: x, y: y, z: z }) +
                        F2_dy.evaluate({ x: x, y: y, z: z }) +
                        F3_dz.evaluate({ x: x, y: y, z: z });

                    const color = getColor(
                        divergence,
                        minDivergence,
                        maxDivergence
                    );

                    const geometry = new THREE.BufferGeometry();
                    const vertices = new Float32Array([x, y, z]);
                    geometry.setAttribute(
                        "position",
                        new THREE.BufferAttribute(vertices, 3)
                    );

                    // Add the color attribute
                    const colors = new Float32Array([
                        color.r,
                        color.g,
                        color.b,
                    ]);
                    geometry.setAttribute(
                        "color",
                        new THREE.BufferAttribute(colors, 3)
                    );

                    const material = new THREE.PointsMaterial({
                        size: 1,
                        vertexColors: true, // Enable vertex colors
                    });

                    const point = new THREE.Points(geometry, material);
                    components.push(point);
                }
            }
        }

        setSceneComponents(components);
    }, []);

    return (
        <CoordinateSystem
            sceneComponents={sceneComponents}
            description={description}
        />
    );
}
