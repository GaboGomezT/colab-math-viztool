import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function EqPlane1_6_1({ args, id, handleDeleteGraph, canEdit }) {
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

        // get vector magnitude
        const vectorMagnitude = Math.sqrt(
            Math.pow(vector[0], 2) +
                Math.pow(vector[1], 2) +
                Math.pow(vector[2], 2)
        );

        // render the vector as an arrow helper
        const arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(vector[0], vector[1], vector[2]).normalize(),
            new THREE.Vector3(point[0], point[1], point[2]),
            vectorMagnitude,
            0x0000ff
        );
        components.push(arrowHelper);

        // given the point and the vector, we can calculate the parametric equation of the plane
        // x = x0 + at
        // y = y0 + bt
        // z = z0 + ct
        // where (x0, y0, z0) is the point and (a, b, c) is the vector and t is a real number
        // we can choose any value for t and we will get a point on the plane
        // we can also choose any value for t and we will get a point on the plane
        // render the plane as a blue plane
        const planeGeometry = new THREE.PlaneGeometry(10, 10, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.position.set(point[0], point[1], point[2]);
        planeMesh.lookAt(
            new THREE.Vector3(
                point[0] + vector[0],
                point[1] + vector[1],
                point[2] + vector[2]
            )
        );
        components.push(planeMesh);
        const pointOnPlane = point; // replace with any point on the plane
        const normalVector = [vector[0], vector[1], vector[2]]; // replace with the normal vector of the plane
        const D =
            -1 *
            (normalVector[0] * pointOnPlane[0] +
                normalVector[1] * pointOnPlane[1] +
                normalVector[2] * pointOnPlane[2]);
        // create a string for the plane equation in the form of Ax + By + Cz + D = 0
        const planeEquation =
            "Ecuación: " +
            vector[0] +
            "x + " +
            vector[1] +
            "y + " +
            vector[2] +
            "z + (" +
            D +
            ") = 0";

        setDescription(planeEquation);

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
