// Reducer ---------------------------------------------------------------------
export default function messagesReducer(messages = [], action) {
    console.log("messages", messages);
    if (action.type === "messages/received") {
        console.log("Payload received: ", action);
        return (messages = action.payload.messages.reverse());
    } else if (action.type === "message/new") {
        return (messages = [...messages, action.payload]);
    }

    return messages;
}

// Action Creators -------------------------------------------------------------
export function MessagesReceived(messages) {
    console.log("Inside of messagesReceived: ", messages);
    return {
        type: "messages/received",
        payload: messages,
    };
}

export function MessageReceived(message) {
    console.log("Inside of messageReceived: ", message);
    return {
        type: "message/new",
        payload: message,
    };
}
