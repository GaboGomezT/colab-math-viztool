import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./Whiteboard.modules.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faEllipsisVertical,
	faChevronRight,
	faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function Whiteboard() {
	let { boardId } = useParams();
	const canvasRef = useRef(null);
	const [fabricCanvas, setCanvas] = useState(null);
	const [currentColor, setCurrentColor] = useState("#000000"); // Initial color: black
	const [currentBrushSize, setCurrentBrushSize] = useState(5); // Initial brush size: 5
	const socket = useRef(null);
	const navigate = useNavigate();
	const [isErasing, setIsErasing] = useState(false);
	const [board, setBoard] = useState(null);

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
				setBoard(board);
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
			if (isErasing) {
				fabricCanvas.freeDrawingBrush.width = 50; // You can adjust the size of the eraser here
				fabricCanvas.freeDrawingBrush.color = "#ffffff"; // The color of the canvas, used for erasing
			} else {
				fabricCanvas.freeDrawingBrush.width = currentBrushSize;
				fabricCanvas.freeDrawingBrush.color = currentColor;
			}

			setCanvas(fabricCanvas);
		}
	}, [currentBrushSize, currentColor, isErasing]);

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
			const serializedPath = mostRecentPathObject.toJSON();
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
			<div className="canvas-navigation">
				<div className="left">
					<FontAwesomeIcon
						icon={faHome}
						className="home-icon"
						onClick={() => navigate("/tableros")}
					/>
					<span className="title">{board ? board.name : ""}</span>
				</div>
				<FontAwesomeIcon icon={faEllipsisVertical} />
			</div>
			<div className="canvas-parent">
				<div className="left-side-bar">
					<div className="tool-bar">
						<div className="tool">
							<select
								value={currentColor}
								onChange={(e) => handleColorChange(e.target.value)}
								className="color-select"
							>
								<option value="#000000">Negro</option>
								<option value="#ff0000">Rojo</option>
								<option value="#00ff00">Verde</option>
								<option value="#0000ff">Azúl</option>
								<option value="#ffff00">Amarillo</option>
								<option value="#ff00ff">Magenta</option>
							</select>
						</div>
						<div className="tool">
							<select
								value={currentBrushSize}
								onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
								className="size-select"
							>
								<option value={1}>1px</option>
								<option value={3}>3px</option>
								<option value={5}>5px</option>
								<option value={10}>10px</option>
							</select>
						</div>
						<div className="tool">
							<button
								onClick={() => {
									setIsErasing(!isErasing);
								}}
								className={isErasing ? "eraser-btn-active" : "eraser-btn"}
							>
								Borrar
							</button>
						</div>
					</div>
				</div>
				<canvas className="canvas" ref={canvasRef} />
				<div className="right-side-bar"></div>
			</div>
			<div className="sheet-navigation">
				<FontAwesomeIcon icon={faChevronLeft} className="inactive-icon" />
				<span>1/1</span>
				<FontAwesomeIcon icon={faChevronRight} />
			</div>
		</div>
	);
}
