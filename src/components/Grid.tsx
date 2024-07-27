import React from "react";
import styled from "styled-components";

import { Cell, HitType, GameStatus } from "./Board";
import StyledMessageButton from "./StyledMessageButton";

interface GridProps {
	grid: Cell[][];
	status: GameStatus;
}

const GridContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
`;

const GridRow = styled.div`
	display: flex;
`;

interface GridCellProps {
	type?: HitType;
}

const GridCell = styled.div<GridCellProps>`
	width: 50px;
	height: 50px;
	border: 1px solid #000;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 2px;
	font-size: 18px;
	font-weight: bold;
	border: ${({ type }) => `${type == null ? "2px solid #d3d6da" : "none"}`};
	color: ${({ type }) => `${type == null ? "#000" : "#fff"}`};
	box-sizing: border-box;
	background-color: ${({ type }) => {
		switch (type) {
			case "hit":
				return "#6aaa64";
			case "miss":
				return "#787c7e";
			case "partial":
				return "#c9b458";
			default:
				return "#fff";
		}
	}};
`;

const Overlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.2);
	display: flex;
	justify-content: center;
	align-items: center;
	color: #000;
	font-size: 24px;
	font-weight: bold;
`;

const StyledOverlayMessage = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	opacity: 1;
	margin-bottom: 20px;
	background-color: #fff;
	border-radius: 4px;
	padding: 20px;
`;

const Grid: React.FC<GridProps> = ({ grid, status }) => {
	return (
		<GridContainer
			style={{ filter: status !== "playing" ? "grayscale(100%)" : "none" }}
		>
			{grid.map((row, rowIndex) => (
				<GridRow key={rowIndex}>
					{row.map((cell, cellIndex) => (
						<GridCell key={cellIndex} type={cell.type}>
							{cell.value}
						</GridCell>
					))}
				</GridRow>
			))}
			{status !== "playing" && (
				<Overlay>
					<StyledOverlayMessage>
						<div>{status === "won" ? "You won!" : "You lost!"}</div>
						<StyledMessageButton
							onClick={() => {
								window.location.reload();
							}}
						>
							Play Again
						</StyledMessageButton>
					</StyledOverlayMessage>
				</Overlay>
			)}
		</GridContainer>
	);
};

export default Grid;
