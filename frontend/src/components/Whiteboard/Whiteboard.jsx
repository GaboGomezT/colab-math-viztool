import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "./Whiteboard.modules.css";

export default function Whiteboard() {
	let { boardId } = useParams();
	const canvasRef = useRef(null);
	const [canvas, setCanvas] = useState(null);
	const [currentColor, setCurrentColor] = useState("#000000"); // Initial color: black
	const [currentBrushSize, setCurrentBrushSize] = useState(5); // Initial brush size: 5
	const socket = useRef(null);

	useEffect(() => {
		socket.current = io(`${import.meta.env.VITE_BACKEND_API_URL}:3000`); // Replace with your backend server URL
		socket.current.emit("joinSession", boardId);

		const canvas = new fabric.Canvas(canvasRef.current);

		// Set canvas dimensions
		canvas.setDimensions({ width: 1100, height: 600 });

		// Enable free drawing mode
		canvas.isDrawingMode = true;

		// Set free drawing brush options
		canvas.freeDrawingBrush.width = currentBrushSize;
		canvas.freeDrawingBrush.color = currentColor;
		setCanvas(canvas);

		// Handle canvas updates from server
		socket.current.on("canvasUpdate", (data) => {
			canvas.loadFromJSON(data, () => {
				canvas.renderAll();
			});
		});

		return () => {
			// Cleanup on component unmount
			canvas.dispose();
			setCanvas(null);
			socket.current.disconnect();
		};
	}, []);

	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = currentBrushSize;
			canvas.freeDrawingBrush.color = currentColor;
			setCanvas(canvas);
		}
	}, [currentBrushSize, currentColor]);

	const handleColorChange = (color) => {
		setCurrentColor(color);
	};

	const handleBrushSizeChange = (size) => {
		setCurrentBrushSize(size);
	};

	const saveCanvas = () => {
		if (canvas) {
			const canvasData = JSON.stringify(canvas.toJSON());

			// Emit canvas data to the server
			socket.current.emit("canvasUpdate", canvasData, boardId);
		}
	};

	useEffect(() => {
		if (canvas) {
			canvas.on("path:created", saveCanvas);
		}
	}, [canvas]);
	return (
		<div className="whiteboard">
			<div className="canvas-navigation"></div>
			<div className="canvas-parent">
				<div className="left-side-bar">
					<div className="tool-bar">
						<div>
							<label>Color:</label>
							<select
								value={currentColor}
								onChange={(e) => handleColorChange(e.target.value)}
							>
								<option value="#000000">Black</option>
								<option value="#ff0000">Red</option>
								<option value="#00ff00">Green</option>
								<option value="#0000ff">Blue</option>
								<option value="#ffff00">Yellow</option>
								<option value="#ff00ff">Magenta</option>
							</select>
						</div>
						<div>
							<label>Brush Size:</label>

							<select
								value={currentBrushSize}
								onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
							>
								<option value={1}>1px</option>
								<option value={3}>3px</option>
								<option value={5}>5px</option>
								<option value={10}>10px</option>
							</select>
						</div>
					</div>
				</div>
				<canvas className="canvas" ref={canvasRef} />
				<div className="right-side-bar">
					<div className="access-management">manage</div>
				</div>
			</div>
		</div>
	);
}
