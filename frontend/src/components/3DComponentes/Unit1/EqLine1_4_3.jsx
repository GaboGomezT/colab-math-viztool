import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function EqLine1_4_3({ args, id, handleDeleteGraph, canEdit }) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];

        const { point, planeEq } = args;
        const { xo, yo, zo } = point;
        const { A, B, C, D } = planeEq;

        // Given point (xo, yo, zo) and plane equation Ax + By + Cz + D = 0
        // we can calculate the parametric equation of the line
        // x = xo + at
        // y = yo + bt
        // z = zo + ct
        // where (a, b, c) is the vector and t is a real number
        // we can choose any value for t and we will get a point on the line
        // create a string for the line equation in the form of r(t) = r0 + t * v
        const lineEq = `r(t) = (${xo}, ${yo}, ${zo}) + t * (${A}, ${B}, ${C})`;
        setDescription(lineEq);

        // render the point as a red sphere
        const pointGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
        pointMesh.position.set(xo, yo, zo);
        components.push(pointMesh);

        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffa500,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3,
        });

        var geometry = new THREE.PlaneGeometry(10, 10);

        // Modify the vertices by directly manipulating the position attribute
        const position = geometry.attributes.position;

        let count = position ? position.count : 0;

        for (let i = 0; i < count; i++) {
            let x = position.getX(i);
            let y = position.getY(i);
            let z = (-D - A * x - B * y) / C;
            position.setXYZ(i, x, y, z);
        }

        // Need to notify Three.js that the position data of the geometry has changed
        position.needsUpdate = true;

        var plane = new THREE.Mesh(geometry, planeMaterial);
        components.push(plane);

        // Create a custom line material
        const material = new THREE.LineDashedMaterial({
            color: 0x000000, // Set the color of the line
            linewidth: 1, // Set the width of the line
            scale: 1, // Set the scale factor of the dash and gap sizes
            dashSize: 1, // Set the size of the dashes
            gapSize: 1, // Set the size of the gaps
        });

        // Define the line geometry
        const lineGeometry = new THREE.BufferGeometry();
        const positions = [];
        positions.push(xo, yo, zo); // Starting point of the line

        const endPoint = 5; // The t-value at which the line ends
        for (let t = -endPoint; t <= endPoint; t += 0.1) {
            const x = xo + t * A;
            const y = yo + t * B;
            const z = zo + t * C;
            positions.push(x, y, z);
        }

        lineGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );

        // Create the line object
        const line = new THREE.Line(lineGeometry, material);
        line.computeLineDistances(); // This is important to calculate the correct dashed line appearance
        components.push(line);

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
