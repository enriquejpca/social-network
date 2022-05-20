import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [button, setButton] = useState("");

    useEffect(() => {
        //console.log("eooooooooo", props.otherUserId);
        fetch(`/friendship/${props.otherUserId}`)
            .then((res) => res.json())
            .then(({ rows }) => {
                //console.log("Rows: ", rows);
                if (rows.length === 0) {
                    setButton("Send friend request");
                    //return;
                }
                const [friendship] = rows;

                if (friendship.accepted) {
                    setButton("Unfriend");
                } else {
                    if (friendship.recipient_id === props.otherUserId) {
                        setButton("Cancel friend request");
                    } else {
                        setButton("Accept friend request");
                    }
                }
            });
    }, []);

    const handleSubmit = () => {
        fetch("/api/friendship-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId: props.otherUserId,
                action: button,
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                console.log("=====", response);
                setButton(response);
            });
    };

    return (
        <section>
            <button onClick={handleSubmit}>{button}</button>
        </section>
    );
}
