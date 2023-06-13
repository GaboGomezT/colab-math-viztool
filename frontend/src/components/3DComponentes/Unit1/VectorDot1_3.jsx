import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function VectorDot1_3({ args, id, handleDeleteGraph, canEdit }) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        let components = [];

        const { vectorA, vectorB } = args;

        const vectorA3 = new THREE.Vector3(vectorA[0], vectorA[1], vectorA[2]);
        const vectorB3 = new THREE.Vector3(vectorB[0], vectorB[1], vectorB[2]);

        // calculate the dot product of the two vectors
        const dotProduct = vectorA3.dot(vectorB3);

        // calculate the angle between the two vectors
        const angle = vectorA3.angleTo(vectorB3);
        // convert radians to degrees
        const angleDegrees = (angle * 180) / Math.PI;

        console.log(dotProduct);
        console.log(angleDegrees);
        // set the description with values for dotProduct and angleDegrees in spanish
        setDescription(
            `El producto punto: ${dotProduct}, ángulo: ${angleDegrees}°`
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
