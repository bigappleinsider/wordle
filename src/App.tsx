import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";

import Board from "./components/Board";

function App() {
	return (
		<div>
			<Provider store={store}>
				<Board />
			</Provider>
		</div>
	);
}

export default App;
