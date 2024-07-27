import React from "react";
import styled from "styled-components";

import { GameStatus, GuessesMap } from "./Board";

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

interface KeyboardProps {
	status: GameStatus;
	guessesMap: GuessesMap;
	onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({
	status,
	guessesMap,
	onKeyPress,
}) => {
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
							onClick={() => onKeyPress(key)}
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
