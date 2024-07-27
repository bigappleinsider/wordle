import StyledMessageButton from "./StyledMessageButton";

interface Props {
	onPlay: () => void;
}

export default function WelcomeMessage({ onPlay }: Props) {
	return (
		<div>
			<h1>Wordle</h1>

			<h3>Get 6 chances to guess a 5-letter word.</h3>
			<StyledMessageButton onClick={onPlay}>Play</StyledMessageButton>
		</div>
	);
}
