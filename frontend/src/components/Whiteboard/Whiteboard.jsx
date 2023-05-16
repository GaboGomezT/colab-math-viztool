import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import "./Whiteboard.modules.css";

const Whiteboard = () => {
	const canvasRef = useRef(null);
	const [canvas, setCanvas] = useState(null);
	const [currentColor, setCurrentColor] = useState("#000000"); // Initial color: black
	const [currentBrushSize, setCurrentBrushSize] = useState(5); // Initial brush size: 5

	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current);

		// Set canvas dimensions
		canvas.setDimensions({ width: 800, height: 600 });

		// Enable free drawing mode
		canvas.isDrawingMode = true;

		// Set free drawing brush options
		canvas.freeDrawingBrush.width = currentBrushSize;
		canvas.freeDrawingBrush.color = currentColor;
		setCanvas(canvas);
		return () => {
			// Cleanup on component unmount
			canvas.dispose();
			setCanvas(null);
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

	const exportCanvas = () => {
		// Get canvas data as JSON
		const canvasData = JSON.stringify(canvas.toJSON());
		console.log(canvasData);
	};
	return (
		<div>
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
			<button onClick={exportCanvas}>Export</button>
			<canvas className="canvas" ref={canvasRef} />
		</div>
	);
};

export default Whiteboard;
