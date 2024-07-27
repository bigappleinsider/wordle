import React from "react";
import styled from "styled-components";
import Keyboard from "./Keyboard";
import Grid from "./Grid";
import WelcomeMessage from "./WelcomeMessage";

interface BoardProps {
	word: string;
}

export enum HitType {
	Hit = "hit",
	Miss = "miss",
	Partial = "partial",
}
export enum GameStatus {
	Won = "won",
	Lost = "lost",
	Playing = "playing",
	NotStarted = "not started",
}

export enum ControlKeys {
	Backspace = "backspace",
	Enter = "enter",
}

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
	const [status, setStatus] = React.useState<GameStatus>(GameStatus.NotStarted);
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
		const isGameWon = grid[row].every((cell) => cell.type === HitType.Hit);

		if (isGameWon) {
			setStatus(GameStatus.Won);
		} else if (row === grid.length - 1) {
			setStatus(GameStatus.Lost);
		}
	};

	const handleCheckWord = () => {
		const [row] = selectedCell;
		const newGrid = [...grid];
		grid[row].forEach((cell, index) => {
			if (cell.value === word[index]) {
				newGrid[row][index] = { ...cell, type: HitType.Hit };
				handleAddGuess(cell.value, HitType.Hit);
			} else if (word.includes(cell.value)) {
				newGrid[row][index] = { ...cell, type: HitType.Partial };
				handleAddGuess(cell.value, HitType.Partial);
			} else {
				newGrid[row][index] = { ...cell, type: HitType.Miss };
				handleAddGuess(cell.value, HitType.Miss);
			}
		});
		setGrid(newGrid);
		handleCheckGameStatus();
	};

	const handleKeyPress = (letter: string) => {
		const [, row] = selectedCell;
		if (letter === "Backspace") {
			handleBackspace();
		} else if (letter === "Enter") {
			if (row === word.length) {
				handleCheckWord();
				setSelectedCell([selectedCell[0] + 1, 0]);
			}
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
			let userInput = event.key;
			if (/^[a-zA-Z]$/.test(userInput)) {
				userInput = userInput.toUpperCase();
			}
			handleKeyPress(userInput);
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCell, grid]);

	return (
		<StyleBoard>
			{status === GameStatus.NotStarted && (
				<WelcomeMessage onPlay={() => setStatus(GameStatus.Playing)} />
			)}

			{status !== GameStatus.NotStarted && (
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
