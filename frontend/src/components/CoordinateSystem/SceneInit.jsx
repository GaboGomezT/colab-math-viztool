import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class SceneInit {
	constructor(canvasId) {
		// NOTE: Core components to initialize Three.js app.
		this.scene = undefined;
		this.camera = undefined;
		this.renderer = undefined;

		// NOTE: Camera params;
		this.fov = 45;
		this.nearPlane = 1;
		this.farPlane = 1000;
		this.canvasId = canvasId;

		// NOTE: Additional components.
		this.controls = undefined;

		// NOTE: Lighting is basically required.
		this.ambientLight = undefined;
		this.directionalLight = undefined;

		this.billboardText = [];
	}

	initialize() {
		this.scene = new THREE.Scene();
		// Set the background color
		this.scene.background = new THREE.Color("White");
		this.camera = new THREE.PerspectiveCamera(
			this.fov,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		this.camera.position.x = 20;
		this.camera.position.y = 5;
		this.camera.position.z = 20;

		// NOTE: Specify a canvas which is already created in the HTML.
		const canvas = document.getElementById(this.canvasId);
		const canvasContainer = document.getElementById("coord-container");
		const dragBar = document.getElementById("drag-bar");
		const resizeHandle = document.getElementById("resize-handle");

		this.renderer = new THREE.WebGLRenderer({
			canvas,
			// NOTE: Anti-aliasing smooths out the edges.
			antialias: true,
		});

		this.renderer.setSize(400, 400);
		canvasContainer.appendChild(this.renderer.domElement);

		this.clock = new THREE.Clock();
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		// ambient light which is for the whole scene
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.ambientLight.castShadow = true;
		this.scene.add(this.ambientLight);

		// directional light - parallel sun rays
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		// this.directionalLight.castShadow = true;
		this.directionalLight.position.set(0, 32, 64);
		this.scene.add(this.directionalLight);

		// Make the scene draggable
		dragBar.addEventListener("mousedown", startDrag);
		dragBar.addEventListener("touchstart", startDrag);

		function startDrag(e) {
			e.preventDefault();
			let offsetX, offsetY;
			if (e.type === "touchstart") {
				offsetX = e.touches[0].clientX - canvasContainer.offsetLeft;
				offsetY = e.touches[0].clientY - canvasContainer.offsetTop;
			} else {
				// 'mousedown'
				offsetX = e.clientX - canvasContainer.offsetLeft;
				offsetY = e.clientY - canvasContainer.offsetTop;
			}

			function mouseMoveHandler(e) {
				let clientX, clientY;
				if (e.type === "touchmove") {
					clientX = e.touches[0].clientX;
					clientY = e.touches[0].clientY;
				} else {
					// 'mousemove'
					clientX = e.clientX;
					clientY = e.clientY;
				}
				canvasContainer.style.top = clientY - offsetY + "px";
				canvasContainer.style.left = clientX - offsetX + "px";
			}

			function reset() {
				document.removeEventListener("mousemove", mouseMoveHandler);
				document.removeEventListener("mouseup", reset);
				document.removeEventListener("touchmove", mouseMoveHandler);
				document.removeEventListener("touchend", reset);
			}

			document.addEventListener("mousemove", mouseMoveHandler);
			document.addEventListener("mouseup", reset);
			document.addEventListener("touchmove", mouseMoveHandler);
			document.addEventListener("touchend", reset);
		}

		const startResize = (e) => {
			e.preventDefault();
			let initialWidth = canvasContainer.offsetWidth;
			let initialHeight = canvasContainer.offsetHeight;
			let initialMouseX, initialMouseY;
			if (e.type === "touchstart") {
				initialMouseX = e.touches[0].clientX;
				initialMouseY = e.touches[0].clientY;
			} else {
				// 'mousedown'
				initialMouseX = e.clientX;
				initialMouseY = e.clientY;
			}

			const mouseMoveHandler = (e) => {
				let clientX, clientY;
				if (e.type === "touchmove") {
					clientX = e.touches[0].clientX;
					clientY = e.touches[0].clientY;
				} else {
					// 'mousemove'
					clientX = e.clientX;
					clientY = e.clientY;
				}
				let newWidth = initialWidth + (clientX - initialMouseX);
				let newHeight = initialHeight + (clientY - initialMouseY);
				canvasContainer.style.width = newWidth + "px";
				canvasContainer.style.height = newHeight + "px";
				// Resize the renderer and update camera aspect ratio
				this.renderer.setSize(newWidth, newHeight);
				this.camera.aspect = newWidth / newHeight;
				this.camera.updateProjectionMatrix();
			};

			function reset() {
				document.removeEventListener("mousemove", mouseMoveHandler);
				document.removeEventListener("mouseup", reset);
				document.removeEventListener("touchmove", mouseMoveHandler);
				document.removeEventListener("touchend", reset);
			}

			document.addEventListener("mousemove", mouseMoveHandler);
			document.addEventListener("mouseup", reset);
			document.addEventListener("touchmove", mouseMoveHandler);
			document.addEventListener("touchend", reset);
		};
		resizeHandle.addEventListener("mousedown", startResize);
		resizeHandle.addEventListener("touchstart", startResize);
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this));
		this.render();
		this.controls.update();
	}

	render() {
		let camera = this.camera;
		this.billboardText.forEach(function (text) {
			text.lookAt(camera.position);
		});
		this.renderer.render(this.scene, this.camera);
	}
}
