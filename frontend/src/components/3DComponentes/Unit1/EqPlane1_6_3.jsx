import React, { useEffect, useState } from "react";
import * as THREE from "three";
import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function EqPlane1_6_3({ args }) {
    const [sceneComponents, setSceneComponents] = useState([]);
    const [description, setDescription] = useState("");
    function arePointsCollinear(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        const det =
            x1 * y2 * z3 +
            y1 * z2 * x3 +
            z1 * x2 * y3 -
            z1 * y2 * x3 -
            y1 * x2 * z3 -
            x1 * z2 * y3;
        return det === 0;
    }

    function calculatePlaneEquation(A, B, C) {
        const AB = new THREE.Vector3().subVectors(B, A);
        const AC = new THREE.Vector3().subVectors(C, A);

        // Calculate the normal vector to the plane (cross product of AB and AC)
        const normal = new THREE.Vector3().crossVectors(AB, AC);

        // Coefficients for the plane equation are the components of the normal vector
        const a = normal.x;
        const b = normal.y;
        const c = normal.z;

        // Compute d by substituting point A into the plane equation
        const d = -(a * A.x + b * A.y + c * A.z);

        return { a, b, c, d };
    }

    useEffect(() => {
        let components = [];
        const { pointA, pointB, pointC } = args;

        // render the point as a red sphere
        const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32);

        const pointAMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const pointAMesh = new THREE.Mesh(pointGeometry, pointAMaterial);
        pointAMesh.position.set(pointA[0], pointA[1], pointA[2]);
        components.push(pointAMesh);

        const pointBMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const pointBMesh = new THREE.Mesh(pointGeometry, pointBMaterial);
        pointBMesh.position.set(pointB[0], pointB[1], pointB[2]);
        components.push(pointBMesh);

        const pointCMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const pointCMesh = new THREE.Mesh(pointGeometry, pointCMaterial);
        pointCMesh.position.set(pointC[0], pointC[1], pointC[2]);
        components.push(pointCMesh);

        // use the three points to determine if they are collinear
        const areCollinear = arePointsCollinear(
            pointA[0],
            pointA[1],
            pointA[2],
            pointB[0],
            pointB[1],
            pointB[2],
            pointC[0],
            pointC[1],
            pointC[2]
        );

        if (areCollinear) {
            // Set description in spanish
            setDescription(
                "Los puntos A, B y C son colineales, por lo tanto, el plano que pasa por ellos no existe."
            );
            setSceneComponents(components);

            return;
        }

        // determine plane given three points
        const plane = new THREE.Plane();
        const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.setFromCoplanarPoints(
            new THREE.Vector3(pointA[0], pointA[1], pointA[2]),
            new THREE.Vector3(pointB[0], pointB[1], pointB[2]),
            new THREE.Vector3(pointC[0], pointC[1], pointC[2])
        );
        planeMesh.lookAt(plane.normal);
        planeMesh.position.set(
            (pointA[0] + pointB[0] + pointC[0]) / 3,
            (pointA[1] + pointB[1] + pointC[1]) / 3,
            (pointA[2] + pointB[2] + pointC[2]) / 3
        );
        components.push(planeMesh);

        const { a, b, c, d } = calculatePlaneEquation(
            new THREE.Vector3(pointA[0], pointA[1], pointA[2]),
            new THREE.Vector3(pointB[0], pointB[1], pointB[2]),
            new THREE.Vector3(pointC[0], pointC[1], pointC[2])
        );

        const planeEquation = `Plano: ${a}x + ${b}y + ${c}z + ${d} = 0`;
        setDescription(planeEquation);

        setSceneComponents(components);
    }, []);
    return (
        <CoordinateSystem
            sceneComponents={sceneComponents}
            description={description}
        />
    );
}
