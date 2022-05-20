import { io } from "socket.io-client";
import { MessagesReceived, MessageReceived } from "./redux/messages/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        console.log("Connecting socket");
        socket = io.connect();
        socket.on("last-10-messages", (messages) => {
            // Update the redux store
            store.dispatch(MessagesReceived(messages));
        });
        socket.on("message", (message) =>
            store.dispatch(MessageReceived(message))
        );
    }
};
