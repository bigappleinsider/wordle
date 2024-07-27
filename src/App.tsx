import React from "react";

import Board from "./components/Board";

const words = ["APPLE", "GRAPE", "PEACH", "MANGO", "BERRY"];
function getRandomWord() {
	const randomIndex = Math.floor(Math.random() * words.length);
	return words[randomIndex];
}
function App() {
	const [randomWord, setRandomWord] = React.useState("");

	React.useEffect(() => {
		const word = getRandomWord();
		setRandomWord(word);
	}, []);
	return (
		<div>
			<Board word={randomWord} />
		</div>
	);
}

export default App;
