import { combineReducers } from "redux";
//import friendsReducer here. The friendsReducer is the friendsWannabeesReducer that is in slice.js
import friendsWannabeesReducer from "./friends/slice";
import messagesReducer from "./messages/slice.js";

const rootReducer = combineReducers({
    friendsWannabees: friendsWannabeesReducer,
    messages: messagesReducer,
});

export default rootReducer;
