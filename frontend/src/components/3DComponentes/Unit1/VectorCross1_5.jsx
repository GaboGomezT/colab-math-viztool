import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function VectorCross1_5({
    args,
    id,
    handleDeleteGraph,
    canEdit,
}) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];

        const { vectorA, vectorB } = args;

        let vectorA3 = new THREE.Vector3(vectorA[0], vectorA[1], vectorA[2]);
        let vectorB3 = new THREE.Vector3(vectorB[0], vectorB[1], vectorB[2]);

        // calculate the cross product of the two vectors
        const crossProduct = new THREE.Vector3();
        crossProduct.crossVectors(vectorA3, vectorB3);

        // set the description with values for crossProduct in spanish
        setDescription(
            `Vector Normal: (${crossProduct.x}, ${crossProduct.y}, ${crossProduct.z})`
        );

        // render vector A as an arrow helper
        const lengthA = Math.sqrt(
            Math.pow(vectorA[0], 2) +
                Math.pow(vectorA[1], 2) +
                Math.pow(vectorA[2], 2)
        );
        // color for red
        const colorA = 0xff0000;
        const arrowHelperA = new THREE.ArrowHelper(
            vectorA3.normalize(),
            new THREE.Vector3(0, 0, 0),
            lengthA,
            colorA
        );
        components.push(arrowHelperA);

        // render vector B as an arrow helper
        const lengthB = Math.sqrt(
            Math.pow(vectorB[0], 2) +
                Math.pow(vectorB[1], 2) +
                Math.pow(vectorB[2], 2)
        );
        // color for green
        const colorB = 0x00ff00;
        const arrowHelperB = new THREE.ArrowHelper(
            vectorB3.normalize(),
            new THREE.Vector3(0, 0, 0),
            lengthB,
            colorB
        );
        components.push(arrowHelperB);

        // render cross product as an arrow helper
        const lengthCross = Math.sqrt(
            Math.pow(crossProduct.x, 2) +
                Math.pow(crossProduct.y, 2) +
                Math.pow(crossProduct.z, 2)
        );
        // color for blue
        const colorCross = 0x000000;
        const arrowHelperCross = new THREE.ArrowHelper(
            crossProduct.normalize(),
            new THREE.Vector3(0, 0, 0),
            lengthCross,
            colorCross
        );
        components.push(arrowHelperCross);

        // Create plane
        const planeGeometry = new THREE.PlaneGeometry(20, 20); // size can be adjusted
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00, // color can be adjusted
            side: THREE.DoubleSide,
            opacity: 0.5,
            transparent: true,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // Position plane at midpoint of vectorA3 and vectorB3
        vectorA3 = new THREE.Vector3(vectorA[0], vectorA[1], vectorA[2]);
        vectorB3 = new THREE.Vector3(vectorB[0], vectorB[1], vectorB[2]);

        const midpoint = new THREE.Vector3();
        // midpoint.addVectors(vectorA3, vectorB3).multiplyScalar(0.5);
        plane.position.copy(midpoint);

        // // Orient plane to face towards crossProduct
        plane.lookAt(crossProduct);

        components.push(plane);

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
