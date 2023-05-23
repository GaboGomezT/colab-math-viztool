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
	const [sheets, setSheets] = useState({});
	const [currentSheet, setCurrentSheet] = useState(null);
	const sheetsRef = useRef(sheets);
	const [isActive, setIsActive] = useState(false);

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
				const firstSheet = board.sheets[0];
				setCurrentSheet(firstSheet.id);
				if (firstSheet.history) {
					firstSheet.history.forEach((pathObject) => {
						const path = new fabric.Path(pathObject.path, pathObject);
						canvas.add(path);
					});
				}

				board.sheets.forEach((sheet) => {
					setSheets((prevSheets) => {
						return {
							...prevSheets,
							[sheet.id]: { ...sheet, index: board.sheets.indexOf(sheet) },
						};
					});
				});
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
		sheetsRef.current = sheets;
	}, [sheets]);

	useEffect(() => {
		if (Object.keys(sheetsRef.current).length !== 0) {
			// Handle canvas updates from server
			socket.current.on("canvasServerUpdate", (pathObject, sheetId) => {
				const updatedSheet = sheetsRef.current[sheetId];
				updatedSheet.history.push(pathObject);
				setSheets((prevSheets) => {
					return {
						...prevSheets,
						[sheetId]: updatedSheet,
					};
				});
				if (sheetId === currentSheet) {
					const path = new fabric.Path(pathObject.path, pathObject);
					fabricCanvas.add(path);
					setCanvas(fabricCanvas);
				}
			});
		}
	}, [currentSheet]);

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

			// Emit canvas data to the server
			const serializedPath = mostRecentPathObject.toJSON();
			socket.current.emit(
				"canvasClientUpdate",
				serializedPath,
				boardId,
				currentSheet
			);
		}
	};

	useEffect(() => {
		if (fabricCanvas && currentSheet) {
			fabricCanvas.off("path:created");
			fabricCanvas.on("path:created", saveCanvas);
		}
	}, [fabricCanvas, currentSheet]);

	const createSheet = async () => {
		const authToken = localStorage.getItem("access_token");
		if (!authToken) {
			navigate("/");
			return; // Return early if authToken is not present
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_API_URL}/boards/${boardId}/sheets`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": authToken,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const sheet = await response.json();
			return sheet;
			// You can perform additional operations here if needed
		} catch (error) {
			console.error(
				"There was a problem with the fetch operation (creating sheet):",
				boardId,
				error
			);
		}
	};

	const handleForward = async () => {
		const currentSheetIndex = sheets[currentSheet].index;

		// If I'm on the last sheet, create a new one
		let nextSheet;
		if (currentSheetIndex + 1 === Object.keys(sheets).length) {
			try {
				nextSheet = await createSheet();
				setSheets((prevSheets) => {
					return {
						...prevSheets,
						[nextSheet.id]: { ...nextSheet, index: currentSheetIndex + 1 },
					};
				});
			} catch (error) {
				console.error("Error creating sheet:", error);
				return; // Return early if an error occurred during sheet creation
			}
		} else {
			nextSheet = Object.values(sheets).find(
				(sheet) => sheet.index === currentSheetIndex + 1
			);
		}

		setCurrentSheet(nextSheet.id);
		// remove all paths from canvas
		fabricCanvas.forEachObject((object) => {
			if (object.type === "path") {
				fabricCanvas.remove(object);
			}
		});

		if (nextSheet.history) {
			nextSheet.history.forEach((pathObject) => {
				const path = new fabric.Path(pathObject.path, pathObject);
				fabricCanvas.add(path);
			});
		}
		setCanvas(fabricCanvas);
		setIsActive(true);
	};

	const handleBackward = () => {
		const currentSheetIndex = sheets[currentSheet].index;
		if (currentSheetIndex === 0) {
			return;
		}
		const previousSheet = Object.values(sheets).find(
			(sheet) => sheet.index === currentSheetIndex - 1
		);
		setCurrentSheet(previousSheet.id);
		// remove all paths from canvas
		fabricCanvas.forEachObject((object) => {
			if (object.type === "path") {
				fabricCanvas.remove(object);
			}
		});
		if (previousSheet.history) {
			previousSheet.history.forEach((pathObject) => {
				const path = new fabric.Path(pathObject.path, pathObject);
				fabricCanvas.add(path);
			});
		}
		setCanvas(fabricCanvas);
		if (previousSheet.index === 0) {
			setIsActive(false);
		}
	};

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
				<FontAwesomeIcon
					icon={faChevronLeft}
					className={isActive ? "" : "inactive-icon"}
					onClick={handleBackward}
				/>
				<span>
					{sheets[currentSheet] ? sheets[currentSheet].index + 1 : ""}/
					{Object.keys(sheets).length}
				</span>
				<FontAwesomeIcon icon={faChevronRight} onClick={handleForward} />
			</div>
		</div>
	);
}
