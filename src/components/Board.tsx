import React from "react";
import styled from "styled-components";
import Keyboard from "./Keyboard";
import Grid from "./Grid";
import WelcomeMessage from "./WelcomeMessage";

interface BoardProps {
	word: string;
}

export type HitType = "hit" | "miss" | "partial";
export type GameStatus = "won" | "lost" | "playing" | "not started";

export type GuessesMap = {
	[key: string]: HitType;
};

export interface Cell {
	value: string;
	type?: HitType;
}

const StyleBoard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export default function Board({ word }: BoardProps) {
	const [status, setStatus] = React.useState<GameStatus>("not started");
	const [grid, setGrid] = React.useState<Cell[][]>(
		Array.from({ length: 6 }, () => Array(5).fill({ value: "" }))
	);
	const [selectedCell, setSelectedCell] = React.useState<[number, number]>([
		0, 0,
	]);

	const [guessesMap, setGuessesMap] = React.useState<GuessesMap>({});

	const handleAddGuess = (guess: string, type: HitType) => {
		setGuessesMap((prevGuessesMap) => ({ ...prevGuessesMap, [guess]: type }));
	};

	const handleBackspace = () => {
		const [row, col] = selectedCell;
		if (col === 0) return;
		const newGrid = [...grid];
		newGrid[row][col - 1] = { value: "" };
		setGrid(newGrid);
		setSelectedCell([row, col - 1]);
	};

	const handleCheckGameStatus = () => {
		const [row] = selectedCell;
		const isGameWon = grid[row].every((cell) => cell.type === "hit");

		if (isGameWon) {
			setStatus("won");
		} else if (row === grid.length - 1) {
			setStatus("lost");
		}
	};

	const handleCheckWord = () => {
		const [row] = selectedCell;
		const newGrid = [...grid];
		grid[row].forEach((cell, index) => {
			if (cell.value === word[index]) {
				newGrid[row][index] = { ...cell, type: "hit" };
				handleAddGuess(cell.value, "hit");
			} else if (word.includes(cell.value)) {
				newGrid[row][index] = { ...cell, type: "partial" };
				handleAddGuess(cell.value, "partial");
			} else {
				newGrid[row][index] = { ...cell, type: "miss" };
				handleAddGuess(cell.value, "miss");
			}
		});
		setGrid(newGrid);
		handleCheckGameStatus();
	};

	const handleKeyPress = (letter: string) => {
		if (letter === "Backspace") {
			handleBackspace();
		} else if (letter === "Enter") {
			handleCheckWord();
			setSelectedCell([selectedCell[0] + 1, 0]);
		} else {
			const [row, col] = selectedCell;
			if (col >= grid[0].length) return;
			const newGrid = [...grid];
			newGrid[row][col] = { value: letter };
			setGrid(newGrid);
			setSelectedCell([row, col + 1]);
		}
	};

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			handleKeyPress(event.key.toUpperCase());
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCell, grid]);

	return (
		<StyleBoard>
			{status === "not started" && (
				<WelcomeMessage onPlay={() => setStatus("playing")} />
			)}

			{status !== "not started" && (
				<React.Fragment>
					<Grid grid={grid} status={status} />
					<Keyboard
						status={status}
						onKeyPress={(letter: string) => {
							handleKeyPress(letter);
						}}
						guessesMap={guessesMap}
					/>
				</React.Fragment>
			)}
		</StyleBoard>
	);
}
