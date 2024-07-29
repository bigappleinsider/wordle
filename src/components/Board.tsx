import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setStatus } from "../redux/gameSlice";

import Keyboard from "./Keyboard";
import Grid from "./Grid";
import WelcomeMessage from "./WelcomeMessage";

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

export default function Board() {
	const dispatch = useDispatch<AppDispatch>();
	const status = useSelector((state: RootState) => state.game.status);

	const handlePlayGame = () => {
		dispatch(setStatus(GameStatus.Playing));
	};

	return (
		<StyleBoard>
			{status === GameStatus.NotStarted && (
				<WelcomeMessage onPlay={() => handlePlayGame()} />
			)}

			{status !== GameStatus.NotStarted && (
				<React.Fragment>
					<Grid />
					<Keyboard />
				</React.Fragment>
			)}
		</StyleBoard>
	);
}
