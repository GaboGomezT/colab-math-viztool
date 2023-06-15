import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { compile } from "mathjs";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function DoubleIntegral3_2({
    args,
    id,
    handleDeleteGraph,
    canEdit,
}) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];
        const { f_string, a_string, b_string, c, d } = args;

        const f_expr = compile(f_string);
        const a_expr = compile(a_string);
        const b_expr = compile(b_string);

        // El número de subintervalos
        const n = 100;
        const numPlanes = 5; // El número de planos que se cortan con la función

        // El paso en cada dimensión
        const dy = (d - c) / n;

        // Crear la geometría
        const geometry = new THREE.BufferGeometry();
        const planeGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const planeVertices = [];
        const indices = [];
        const planeIndices = [];

        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0x888888,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });

        const domainMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });

        try {
            for (let i = 0; i <= n; i++) {
                const y = c + i * dy;
                const xStart = a_expr.evaluate({ y: y });
                const xEnd = b_expr.evaluate({ y: y });
                const dx = (xEnd - xStart) / n;

                planeVertices.push(xStart, y, 0);
                planeVertices.push(xEnd, y, 0);

                for (let j = 0; j <= n; j++) {
                    const x = xStart + j * dx;
                    const z = f_expr.evaluate({ x: x, y: y });
                    vertices.push(x, y, z);
                }

                // Crea los planos que se cortan con la función
                if (i % Math.floor(n / numPlanes) === 0) {
                    const cuttingPlaneGeometry = new THREE.BufferGeometry();
                    const cuttingPlaneVertices = [];
                    for (let j = 0; j <= n; j++) {
                        const x = xStart + j * dx;
                        const z = f_expr.evaluate({ x: x, y: y });
                        cuttingPlaneVertices.push(x, y, 0);
                        cuttingPlaneVertices.push(x, y, z);
                    }

                    cuttingPlaneGeometry.setAttribute(
                        "position",
                        new THREE.Float32BufferAttribute(
                            cuttingPlaneVertices,
                            3
                        )
                    );

                    const cuttingPlane = new THREE.Mesh(
                        cuttingPlaneGeometry,
                        planeMaterial
                    );
                    components.push(cuttingPlane);
                }
            }
        } catch (error) {
            console.error(error);
            setDescription(
                "Error en la función o en los límites de integración"
            );
        }

        for (let i = 0; i < n; i++) {
            const a = i * 2;
            const b = a + 2;

            planeIndices.push(a, a + 1, b);
            planeIndices.push(a + 1, b, b + 1);
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const a = i * (n + 1) + j;
                const b = a + n + 1;

                indices.push(a, b, a + 1);
                indices.push(a + 1, b, b + 1);
            }
        }

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        planeGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(planeVertices, 3)
        );
        planeGeometry.setIndex(planeIndices);

        // Crear el material y el objeto de malla
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            opacity: 0.5,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        const plane = new THREE.Mesh(planeGeometry, domainMaterial);
        components.push(mesh, plane);

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
