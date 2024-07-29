import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export interface CellType {
	row: number;
	col: number;
}

interface GameState {
	status: GameStatus;
	grid: Cell[][];
	selectedCell: CellType;
	guessesMap: GuessesMap;
	word: string;
}

const words = ["APPLE", "GRAPE", "PEACH", "MANGO", "BERRY"];
function getRandomWord() {
	const randomIndex = Math.floor(Math.random() * words.length);
	return words[randomIndex];
}

const initialState: GameState = {
	status: GameStatus.NotStarted,
	grid: Array.from({ length: 6 }, () => Array(5).fill({ value: "" })),
	selectedCell: {
		row: 0,
		col: 0,
	},
	guessesMap: {},
	word: getRandomWord(),
};

const updateGuessMap = (state: GameState, value: string, nextType: HitType) => {
	const currentType = state.guessesMap[value];

	//empty or Miss => Miss/Partial/Hit
	//Partial => Hit
	//Hit => no change

	if (currentType != null) {
		if (currentType === HitType.Hit) {
			return;
		} else if (currentType === HitType.Partial && nextType !== HitType.Hit) {
			return;
		}
	}

	state.guessesMap[value] = nextType;
};

const checkGameStatus = (state: GameState) => {
	const { row } = state.selectedCell;
	const isGameWon = state.grid[row].every((cell) => cell.type === HitType.Hit);

	if (isGameWon) {
		state.status = GameStatus.Won;
	} else if (row === state.grid.length - 1) {
		state.status = GameStatus.Lost;
	}
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setStatus(state, action: PayloadAction<GameStatus>) {
			state.status = action.payload;
		},
		addGuess(state, action: PayloadAction<{ letter: string }>) {
			const { row, col } = state.selectedCell;
			if (col >= state.grid[0].length) return;
			state.grid[row][col] = { value: action.payload.letter };
			state.selectedCell.col = col + 1;
		},
		backspace(state) {
			const { row, col } = state.selectedCell;
			if (col === 0) return;
			state.grid[row][col - 1] = { value: "" };
			state.selectedCell.col = col - 1;
		},
		checkWord(state) {
			const { col, row } = state.selectedCell;
			if (col !== state.word.length) return;

			state.grid[row].forEach((cell, index) => {
				let type: HitType;
				if (cell.value === state.word[index]) {
					type = HitType.Hit;
				} else if (state.word.includes(cell.value)) {
					type = HitType.Partial;
				} else {
					type = HitType.Miss;
				}
				state.grid[row][index]["type"] = type;

				updateGuessMap(state, cell.value, type);
			});
			//check if game is over
			checkGameStatus(state);
			//move to next row
			if (row < state.grid.length - 1) {
				state.selectedCell.row = state.selectedCell.row + 1;
				state.selectedCell.col = 0;
			}
		},
	},
});

export const { addGuess, backspace, checkWord, setStatus } = gameSlice.actions;
export default gameSlice.reducer;
