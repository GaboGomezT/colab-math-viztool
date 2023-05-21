import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./Whiteboard.modules.css";

export default function Whiteboard() {
	let { boardId } = useParams();
	const canvasRef = useRef(null);
	const [fabricCanvas, setCanvas] = useState(null);
	const [currentColor, setCurrentColor] = useState("#000000"); // Initial color: black
	const [currentBrushSize, setCurrentBrushSize] = useState(5); // Initial brush size: 5
	const socket = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const authToken = localStorage.getItem("access_token");
		if (!authToken) {
			navigate("/");
		}
		socket.current = io(`${import.meta.env.VITE_BACKEND_API_URL}`); // Replace with your backend server URL
		socket.current.emit("joinSession", boardId);

		const canvas = new fabric.Canvas(canvasRef.current);

		// Set canvas dimensions
		canvas.setDimensions({ width: 1100, height: 600 });

		// Enable free drawing mode
		canvas.isDrawingMode = true;

		// Set free drawing brush options
		canvas.freeDrawingBrush.width = currentBrushSize;
		canvas.freeDrawingBrush.color = currentColor;

		// Handle canvas updates from server
		socket.current.on("canvasServerUpdate", (pathObject) => {
			let path = new fabric.Path(pathObject.path, pathObject);
			canvas.add(path);
		});

		// Get board data from server
		fetch(`${import.meta.env.VITE_BACKEND_API_URL}/boards/${boardId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": authToken,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((board) => {
				if (board.history) {
					board.history.forEach((pathObject) => {
						const path = new fabric.Path(pathObject.path, pathObject);
						canvas.add(path);
					});
				}
			})
			.catch((error) => {
				console.error(
					"There was a problem with the fetch operation (getting board):",
					boardId,
					error
				);
			});

		setCanvas(canvas);

		return () => {
			// Cleanup on component unmount
			canvas.dispose();
			setCanvas(null);
			socket.current.disconnect();
		};
	}, []);

	useEffect(() => {
		if (fabricCanvas) {
			fabricCanvas.freeDrawingBrush.width = currentBrushSize;
			fabricCanvas.freeDrawingBrush.color = currentColor;

			setCanvas(fabricCanvas);
		}
	}, [currentBrushSize, currentColor]);

	const handleColorChange = (color) => {
		setCurrentColor(color);
	};

	const handleBrushSizeChange = (size) => {
		setCurrentBrushSize(size);
	};

	const saveCanvas = () => {
		if (fabricCanvas) {
			// Get the most recent pathObject
			const objects = fabricCanvas.getObjects();
			const mostRecentPathObject = objects[objects.length - 1];

			// Emit canvas data to the server with debouncing
			// debouncedClient(mostRecentPathObject);
			const serializedPath = mostRecentPathObject.toJSON();
			// console.log(serializedPath);
			socket.current.emit("canvasClientUpdate", serializedPath, boardId);
		}
	};

	useEffect(() => {
		if (fabricCanvas) {
			fabricCanvas.on("path:created", saveCanvas);
		}
	}, [fabricCanvas]);

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
