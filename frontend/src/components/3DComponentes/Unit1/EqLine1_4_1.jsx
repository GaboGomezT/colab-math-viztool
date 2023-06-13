import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function EqLine1_4_1({ args, id, handleDeleteGraph, canEdit }) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];
        const { point, vector } = args;

        // render the point as a red sphere
        const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
        pointMesh.position.set(point[0], point[1], point[2]);
        components.push(pointMesh);

        // render the vector as an arrow helper
        const vector3 = new THREE.Vector3(vector[0], vector[1], vector[2]);
        const length = Math.sqrt(
            Math.pow(vector[0], 2) +
                Math.pow(vector[1], 2) +
                Math.pow(vector[2], 2)
        );
        const color = 0x00ff00;
        const arrowHelper = new THREE.ArrowHelper(
            vector3.normalize(),
            new THREE.Vector3(point[0], point[1], point[2]),
            length,
            color
        );
        components.push(arrowHelper);

        // given the point and the vector, we can calculate the parametric equation of the line
        // x = x0 + at
        // y = y0 + bt
        // z = z0 + ct
        // where (x0, y0, z0) is the point and (a, b, c) is the vector and t is a real number
        // we can choose any value for t and we will get a point on the line
        // we can also choose any value for t and we will get a point on the line
        // render the line as a blue line
        const lineLength = 10;
        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0x0000ff,
            dashSize: 1,
            gapSize: 1,
        });
        lineMaterial.dashSize = 0.5;
        lineMaterial.gapSize = 0.5;
        lineMaterial.needsUpdate = true;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(
                point[0] - (vector[0] * lineLength) / 2,
                point[1] - (vector[1] * lineLength) / 2,
                point[2] - (vector[2] * lineLength) / 2
            ),
            new THREE.Vector3(
                point[0] + (vector[0] * lineLength) / 2,
                point[1] + (vector[1] * lineLength) / 2,
                point[2] + (vector[2] * lineLength) / 2
            ),
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances();
        components.push(line);

        // create a string with the parametric equation of the line
        const equation = `x = ${point[0]} + ${vector[0]}t; y = ${point[1]} + ${vector[1]}t; z = ${point[2]} + ${vector[2]}t`;
        setDescription(equation);
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
