import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Whiteboard() {
	const { boardId } = useParams();
	const canvasRef = useRef(null);
	const [color, setColor] = useState("#000000");
	const [brushSize, setBrushSize] = useState(3);
	let ctx;

	useEffect(() => {
		const canvas = canvasRef.current;
		ctx = canvas.getContext("2d");

		// Set initial drawing styles
		ctx.strokeStyle = color;
		ctx.lineWidth = brushSize;
		ctx.lineCap = "round";
	}, [color, brushSize]);

	const handleStart = (event) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		ctx.beginPath();
		ctx.moveTo(x, y);

		canvas.addEventListener("mousemove", handleMove);
		canvas.addEventListener("mouseup", handleEnd);
	};

	const handleMove = (event) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		ctx.lineTo(x, y);
		ctx.stroke();
	};

	const handleEnd = () => {
		const canvas = canvasRef.current;
		canvas.removeEventListener("mousemove", handleMove);
		canvas.removeEventListener("mouseup", handleEnd);
	};

	const handleTouchStart = (event) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();

		if (event.touches.length > 0) {
			const x = event.touches[0].clientX - rect.left;
			const y = event.touches[0].clientY - rect.top;

			ctx.beginPath();
			ctx.moveTo(x, y);

			canvas.addEventListener("touchmove", handleTouchMove);
			canvas.addEventListener("touchend", handleTouchEnd);
		}
	};

	const handleTouchMove = (event) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = event.touches[0].clientX - rect.left;
		const y = event.touches[0].clientY - rect.top;

		ctx.lineTo(x, y);
		ctx.stroke();
	};

	const handleTouchEnd = () => {
		const canvas = canvasRef.current;
		canvas.removeEventListener("touchmove", handleTouchMove);
		canvas.removeEventListener("touchend", handleTouchEnd);
	};

	const handleClear = () => {
		const canvas = canvasRef.current;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	const handleColorChange = (event) => {
		setColor(event.target.value);
	};

	const handleBrushSizeChange = (event) => {
		setBrushSize(Number(event.target.value));
	};

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				style={{ border: "1px solid #000000" }}
				onMouseDown={handleStart}
				onTouchStart={handleTouchStart}
			/>
			<div>
				<label htmlFor="color">Color:</label>
				<input
					type="color"
					id="color"
					value={color}
					onChange={handleColorChange}
				/>
			</div>
			<div>
				<label htmlFor="brushSize">Brush Size:</label>
				<input
					type="number"
					id="brushSize"
					value={brushSize}
					onChange={handleBrushSizeChange}
				/>
			</div>
			<button onClick={handleClear}>Clear</button>
		</div>
	);
}
