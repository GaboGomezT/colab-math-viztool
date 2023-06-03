import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function EqLine1_4_2({ args }) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];
        const { pointA, pointB } = args;

        // render the pointA as a red sphere
        const pointAGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const pointAMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const pointAMesh = new THREE.Mesh(pointAGeometry, pointAMaterial);
        pointAMesh.position.set(pointA[0], pointA[1], pointA[2]);
        components.push(pointAMesh);

        // render the pointB as a green sphere
        const pointBGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const pointBMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const pointBMesh = new THREE.Mesh(pointBGeometry, pointBMaterial);
        pointBMesh.position.set(pointB[0], pointB[1], pointB[2]);
        components.push(pointBMesh);

        // given pointA and pointB, we can calculate the parametric equation of the line

        // render the line as a blue line
        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0x0000ff,
            dashSize: 1,
            gapSize: 1,
        });

        // Calculate the direction vector
        let directionVector = new THREE.Vector3().subVectors(
            new THREE.Vector3(pointB[0], pointB[1], pointB[2]),
            new THREE.Vector3(pointA[0], pointA[1], pointA[2])
        );

        // Normalize the direction vector
        directionVector.normalize();

        // Define how much you want to extend the line
        let extensionLength = 100; // This is a placeholder value

        // Calculate new points for the line
        let extendedPointA = new THREE.Vector3().addVectors(
            new THREE.Vector3(pointA[0], pointA[1], pointA[2]),
            directionVector.clone().multiplyScalar(-extensionLength)
        );

        let extendedPointB = new THREE.Vector3().addVectors(
            new THREE.Vector3(pointB[0], pointB[1], pointB[2]),
            directionVector.clone().multiplyScalar(extensionLength)
        );

        // Create a new line with the extended points
        const extendedLineGeometry = new THREE.BufferGeometry().setFromPoints([
            extendedPointA,
            extendedPointB,
        ]);

        const extendedLine = new THREE.Line(extendedLineGeometry, lineMaterial);
        components.push(extendedLine);

        // generate parametric equation of the line from the points
        // x = x1 + at
        // y = y1 + bt
        // z = z1 + ct

        // calculate the direction vector
        const a = pointB[0] - pointA[0];
        const b = pointB[1] - pointA[1];
        const c = pointB[2] - pointA[2];

        // calculate the parametric equation of the line
        const parametricEquation = `x = ${pointA[0]} + ${a}t; y = ${pointA[1]} + ${b}t; z = ${pointA[2]} + ${c}t`;
        setDescription(parametricEquation);
        setSceneComponents(components);
    }, []);
    return (
        <CoordinateSystem
            sceneComponents={sceneComponents}
            description={description}
        />
    );
}
