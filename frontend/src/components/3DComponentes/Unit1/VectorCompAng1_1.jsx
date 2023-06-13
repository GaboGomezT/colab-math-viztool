import React, { useEffect, useState } from "react";
import * as THREE from "three";

import CoordinateSystem from "../../CoordinateSystem/CoordinateSystem";

export default function VectorCompAng1_1({
    args,
    id,
    handleDeleteGraph,
    canEdit,
}) {
    const [sceneComponents, setSceneComponents] = useState([]);

    function radianesAGrados(radianes) {
        return radianes * (180 / Math.PI);
    }

    useEffect(() => {
        let components = [];

        const { rx, ry, rz } = args;

        const magnitud = Math.sqrt(
            Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2)
        );

        if (magnitud === 0) {
            return;
        }
        const alpha = Math.acos(Math.abs(rx) / magnitud);
        const beta = Math.acos(Math.abs(ry) / magnitud);
        const gamma = Math.acos(Math.abs(rz) / magnitud);
        const alphaDeg = radianesAGrados(alpha);
        const betaDeg = radianesAGrados(beta);
        const gammaDeg = radianesAGrados(gamma);
        const respuesta =
            Math.pow(Math.cos(alpha), 2) +
            Math.pow(Math.cos(beta), 2) +
            Math.pow(Math.cos(gamma), 2);

        console.log(
            "Coseno director respecto al eje Z, α =",
            alpha,
            "rad /",
            alphaDeg,
            "°"
        );
        console.log(
            "Coseno director respecto al eje Y, β =",
            beta,
            "rad /",
            betaDeg,
            "°"
        );
        console.log(
            "Coseno director respecto al eje X, ɣ =",
            gamma,
            "rad /",
            gammaDeg,
            "°"
        );
        console.log("cos**2(α) + cos**2(β) + cos**2(ɣ) =", respuesta);

        // Create a vector
        const origin = new THREE.Vector3(0, 0, 0);
        const direction = new THREE.Vector3(rx, ry, rz).normalize();
        const length = magnitud;
        const color = 0x000000;
        const arrowHelper = new THREE.ArrowHelper(
            direction,
            origin,
            length,
            color
        );

        // Add the arrowHelper to the components array
        components.push(arrowHelper);

        const xComponent = new THREE.Vector3(rx, 0, 0);
        const yComponent = new THREE.Vector3(0, ry, 0);
        const zComponent = new THREE.Vector3(0, 0, rz);

        const xComponentArrow = new THREE.ArrowHelper(
            xComponent,
            origin,
            rx,
            color
        );
        const yComponentArrow = new THREE.ArrowHelper(
            yComponent,
            origin,
            ry,
            color
        );
        const zComponentArrow = new THREE.ArrowHelper(
            zComponent,
            origin,
            rz,
            color
        );

        // Add the arrows to the components array
        components.push(xComponentArrow);
        components.push(yComponentArrow);
        components.push(zComponentArrow);

        const resultVector = new THREE.Vector3(rx, ry, rz);

        const xDashMaterial = new THREE.LineDashedMaterial({
            color: 0xff0000,
            dashSize: 0.1,
            gapSize: 0.1,
            linewidth: 1,
        });
        const xGeometry = new THREE.BufferGeometry().setFromPoints([
            xComponent,
            resultVector,
        ]);
        let xLine = new THREE.Line(xGeometry, xDashMaterial);
        xLine.computeLineDistances();

        const yDashMaterial = new THREE.LineDashedMaterial({
            color: 0x00ff00,
            dashSize: 0.1,
            gapSize: 0.1,
            linewidth: 1,
        });
        const yGeometry = new THREE.BufferGeometry().setFromPoints([
            yComponent,
            resultVector,
        ]);
        let yLine = new THREE.Line(yGeometry, yDashMaterial);
        yLine.computeLineDistances();

        const zDashMaterial = new THREE.LineDashedMaterial({
            color: 0x0000ff,
            dashSize: 0.1,
            gapSize: 0.1,
            linewidth: 1,
        });
        const zGeometry = new THREE.BufferGeometry().setFromPoints([
            zComponent,
            resultVector,
        ]);
        let zLine = new THREE.Line(zGeometry, zDashMaterial);
        zLine.computeLineDistances();

        // Add the lines to the components array
        components.push(xLine);
        components.push(yLine);
        components.push(zLine);

        const dashMaterial = new THREE.LineDashedMaterial({
            color: 0x000000,
            dashSize: 0.1,
            gapSize: 0.1,
            linewidth: 1,
        });

        const xFlatGeometry = new THREE.BufferGeometry().setFromPoints([
            xComponent,
            new THREE.Vector3(rx, 0, rz),
        ]);
        let xFlatLine = new THREE.Line(xFlatGeometry, dashMaterial);
        xFlatLine.computeLineDistances();

        const zFlatGeometry = new THREE.BufferGeometry().setFromPoints([
            zComponent,
            new THREE.Vector3(rx, 0, rz),
        ]);
        let zFlatLine = new THREE.Line(zFlatGeometry, dashMaterial);
        zFlatLine.computeLineDistances();

        const xzFlatGeometry = new THREE.BufferGeometry().setFromPoints([
            origin,
            new THREE.Vector3(rx, 0, rz),
        ]);
        let xzFlatLine = new THREE.Line(xzFlatGeometry, dashMaterial);
        xzFlatLine.computeLineDistances();

        const heightGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(rx, 0, rz),
            new THREE.Vector3(rx, ry, rz),
        ]);
        let heightLine = new THREE.Line(heightGeometry, dashMaterial);
        heightLine.computeLineDistances();

        // Add the lines to the components array
        components.push(xFlatLine);
        components.push(zFlatLine);
        components.push(xzFlatLine);
        components.push(heightLine);

        // Add the components to the sceneComponents array
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
