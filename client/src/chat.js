import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
    const [value, setValue] = useState("");
    const messages = useSelector((state) => state?.messages);
    const messagesContainer = useRef();
    //console.log("messageeeeeeee: ", messages);

    useEffect(() => {
        messagesContainer.current.scrollTop =
            messagesContainer.current.scrollHeight;
    }, [messages]);

    const handleChange = (e) => {
        setValue(e.target.value);
        console.log("Value of the textarea", value);
    };

    const submitMessage = () => {
        console.log("Submit message: ", value);
        setValue("");

        socket.emit("message", { message: value });
    };

    return (
        <>
            <section className="chat-section">
                <section ref={messagesContainer}>
                    <h1 className="chath1">CHAT</h1>

                    <div>
                        {messages &&
                            messages.length > 0 &&
                            messages.map((message) => {
                                return (
                                    <div
                                        key={message.id}
                                        className="chatsavedmessage"
                                    >
                                        <p>
                                            {message.first} {message.last} says:{" "}
                                        </p>{" "}
                                        <p>
                                            {message.message}{" "}
                                            {message.created_at}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                </section>

                <textarea
                    value={value}
                    placeholder="Your message"
                    className="chat-textarea"
                    onChange={handleChange}
                ></textarea>
                <button onClick={submitMessage}>Send Message</button>
            </section>
        </>
    );
}
