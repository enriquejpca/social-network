import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
//import Logo from "./logo.js";
import App from "./app";

import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer";
import { Provider } from "react-redux";

import { init } from "./socket.js";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

//ReactDOM.render(<Welcome />, document.querySelector("main")); //Esta es la que había en primer lugar.

fetch("/user/id.json")
    //This means the user does not have the right cookie, ans should see registration, (login or pw reset)
    .then((response) => response.json())
    .then((data) => {
        init(store);
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //this mean the user is logged in cause their browser did
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    });
