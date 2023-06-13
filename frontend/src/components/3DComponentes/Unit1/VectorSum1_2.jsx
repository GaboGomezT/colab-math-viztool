import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function VectorSum1_2({ args, id, handleDeleteGraph, canEdit }) {
    const [sceneComponents, setSceneComponents] = useState([]);

    useEffect(() => {
        let components = [];

        // vector is a list of vectors containing the components of the vector
        const { vectors } = args;

        // calculate the sum of all vectors
        const sum = vectors.reduce((acc, vector) => {
            return acc.add(new THREE.Vector3(vector[0], vector[1], vector[2]));
        }, new THREE.Vector3(0, 0, 0));

        // for each vector in the list
        // create an arrow helper with three.js
        // and add it to the components list
        let startingPoint = new THREE.Vector3(0, 0, 0);
        vectors.forEach((vector, index) => {
            const length = Math.sqrt(
                Math.pow(vector[0], 2) +
                    Math.pow(vector[1], 2) +
                    Math.pow(vector[2], 2)
            );
            const r = Math.floor(Math.random() * 128) + 128;
            const g = Math.floor(Math.random() * 128) + 128;
            const b = Math.floor(Math.random() * 128) + 128;
            const color = (r << 16) | (g << 8) | b;
            const currentVector = new THREE.Vector3(
                vector[0],
                vector[1],
                vector[2]
            );

            let arrowHelper;

            const normVector = currentVector.clone();
            normVector.normalize();
            if (index === 0) {
                arrowHelper = new THREE.ArrowHelper(
                    normVector,
                    new THREE.Vector3(0, 0, 0),
                    length,
                    color
                );
            } else {
                arrowHelper = new THREE.ArrowHelper(
                    normVector,
                    startingPoint,
                    length,
                    color
                );
            }
            startingPoint.add(currentVector);

            components.push(arrowHelper);
        });

        // create ArrowHelper for startingPoint
        const length = Math.sqrt(
            Math.pow(sum.x, 2) + Math.pow(sum.y, 2) + Math.pow(sum.z, 2)
        );
        const arrowHelper = new THREE.ArrowHelper(
            sum.normalize(),
            new THREE.Vector3(0, 0, 0),
            length,
            0x000000
        );
        components.push(arrowHelper);

        setSceneComponents(components);
    }, []);
    return (
        <CoordinateSystem
            sceneComponents={sceneComponents}
            id={id}
            handleDeleteGraph={handleDeleteGraph}
            canEdit={canEdit}
        />
    );
}
