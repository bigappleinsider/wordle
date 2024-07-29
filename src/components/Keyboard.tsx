import styled from "styled-components";

import { GameStatus } from "./Board";
import { RootState, AppDispatch } from "../redux/store";
import { addGuess, backspace, checkWord } from "../redux/gameSlice";

import { useSelector, useDispatch } from "react-redux";

const StyledKeyboardButton = styled.button`
	height: 58px;
	margin-right: 6px;
	border: none;
	font-weight: bold;
	font-size: 20px;
	border-radius: 4px;
	display: 4px;
	flex: 1;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	background-color: ${({ value }) => {
		switch (value) {
			case "hit":
				return "#6aaa64";
			case "miss":
				return "#787c7e";
			case "partial":
				return "#c9b458";
			default:
				return "#d3d6da";
		}
	}};
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
	pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const StyledKeyboardRow = styled.div`
	display: flex;
	margin-bottom: 8px;
	width: 560px;
`;

const Keyboard = () => {
	const dispatch = useDispatch<AppDispatch>();
	const status = useSelector((state: RootState) => state.game.status);
	const guessesMap = useSelector((state: RootState) => state.game.guessesMap);

	const handleKeyPress = (letter: string) => {
		if (letter === "Backspace") {
			dispatch(backspace());
		} else if (letter === "Enter") {
			dispatch(checkWord());
		} else {
			dispatch(addGuess({ letter }));
		}
	};

	const keys = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
	];

	return (
		<div>
			{keys.map((row, rowIndex) => (
				<StyledKeyboardRow key={rowIndex}>
					{row.map((key) => (
						<StyledKeyboardButton
							key={key}
							disabled={status !== GameStatus.Playing}
							value={guessesMap[key]}
							onClick={() => handleKeyPress(key)}
						>
							{key}
						</StyledKeyboardButton>
					))}
				</StyledKeyboardRow>
			))}
		</div>
	);
};

export default Keyboard;
